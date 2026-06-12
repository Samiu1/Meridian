/**
 * Eval harness. Convention: no skill ships without cases here.
 *
 * Each dataset row runs the agent against fixture inputs, then applies its
 * `checks`. Structural checks (sections present, citations formatted) are
 * code; judgment checks (does the Problem section reflect the evidence) go
 * to an LLM judge. v1 implements the structural layer only.
 *
 * Usage:
 *   npm run evals              # run all cases
 *   npm run evals -- --case prd-basic   # run one case
 *   npm run evals -- --dry-run          # parse + resolve checks without calling the model
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { runAgent, pendingApprovals } from "../src/agent/run-agent.js";
import type { SessionLine } from "../src/agent/types.js";
import { resolveCheck, type CheckResult } from "./checks.js";

interface EvalCase {
  id: string;
  skill: string;
  prompt: string;
  checks: string[];
}

const EVAL_WORKSPACE = "eval";

interface CaseResult {
  id: string;
  checks: Array<{ name: string; result: CheckResult }>;
  error?: string;
  durationMs: number;
}

async function runCase(c: EvalCase): Promise<CaseResult> {
  const lines: SessionLine[] = [];
  const start = Date.now();

  try {
    await runAgent({
      prompt: c.prompt,
      workspaceId: EVAL_WORKSPACE,
      onLine: (line) => lines.push(line),
      onApprovalRequested: (approval) => {
        const pending = pendingApprovals.get(approval.id);
        if (pending) pending.resolve(false);
      },
    });
  } catch (err) {
    return {
      id: c.id,
      checks: [],
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - start,
    };
  }

  const checkResults: CaseResult["checks"] = [];
  for (const name of c.checks) {
    try {
      const fn = resolveCheck(name);
      const result = await fn(lines, { prompt: c.prompt });
      checkResults.push({ name, result });
    } catch (err) {
      checkResults.push({
        name,
        result: { pass: false, detail: `check error: ${err instanceof Error ? err.message : String(err)}` },
      });
    }
  }

  return { id: c.id, checks: checkResults, durationMs: Date.now() - start };
}

function printResult(r: CaseResult): void {
  const passed = r.checks.filter((c) => c.result.pass).length;
  const total = r.checks.length;
  const status = r.error ? "ERROR" : passed === total ? "PASS" : "FAIL";
  const icon = { PASS: "✓", FAIL: "✗", ERROR: "!" }[status];

  console.log(`\n${icon} ${r.id}  (${passed}/${total} checks, ${(r.durationMs / 1000).toFixed(1)}s)`);
  if (r.error) console.log(`  error: ${r.error}`);
  for (const c of r.checks) {
    const mark = c.result.pass ? "  ✓" : "  ✗";
    console.log(`${mark} ${c.name}: ${c.result.detail}`);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const caseFlag = args.indexOf("--case");
  const caseFilter = caseFlag !== -1 ? args[caseFlag + 1] : undefined;

  const raw = await readFile(path.resolve("evals/dataset.jsonl"), "utf8");
  let cases = raw.split("\n").filter(Boolean).map((l) => JSON.parse(l) as EvalCase);

  if (caseFilter) {
    cases = cases.filter((c) => c.id === caseFilter);
    if (cases.length === 0) {
      console.error(`no eval case with id "${caseFilter}"`);
      process.exit(1);
    }
  }

  console.log(`Loaded ${cases.length} eval case(s).`);

  if (dryRun) {
    for (const c of cases) {
      console.log(`\n  ${c.id}: ${c.checks.length} checks`);
      for (const name of c.checks) {
        try {
          resolveCheck(name);
          console.log(`    ✓ ${name} (resolved)`);
        } catch (err) {
          console.log(`    ✗ ${name} (${err instanceof Error ? err.message : "unknown"})`);
        }
      }
    }
    console.log("\nDry run complete — all checks resolved. Run without --dry-run to execute.");
    return;
  }

  const results: CaseResult[] = [];
  for (const c of cases) {
    console.log(`\nRunning: ${c.id}...`);
    const result = await runCase(c);
    results.push(result);
    printResult(result);
  }

  // Summary
  const totalChecks = results.reduce((s, r) => s + r.checks.length, 0);
  const passedChecks = results.reduce((s, r) => s + r.checks.filter((c) => c.result.pass).length, 0);
  const errorCases = results.filter((r) => r.error).length;
  const totalDuration = results.reduce((s, r) => s + r.durationMs, 0);

  console.log("\n" + "=".repeat(60));
  console.log(`Results: ${passedChecks}/${totalChecks} checks passed across ${results.length} case(s)`);
  if (errorCases) console.log(`  ${errorCases} case(s) errored before checks ran`);
  console.log(`Total time: ${(totalDuration / 1000).toFixed(1)}s`);

  const failed = totalChecks - passedChecks;
  if (failed > 0 || errorCases > 0) process.exit(1);
}

main().catch((err) => {
  console.error("eval run failed:", err);
  process.exit(1);
});
