/**
 * Eval harness skeleton. Convention: no skill ships without cases here.
 *
 * Each dataset row runs the agent against fixture inputs, then applies its
 * `checks`. Structural checks (sections present, citations formatted) are
 * code; judgment checks (does the Problem section reflect the evidence) go
 * to an LLM judge. v1 implements the structural layer only.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

interface EvalCase {
  id: string;
  skill: string;
  prompt: string;
  checks: string[];
}

async function main(): Promise<void> {
  const raw = await readFile(path.resolve("evals/dataset.jsonl"), "utf8");
  const cases = raw.split("\n").filter(Boolean).map((l) => JSON.parse(l) as EvalCase);

  console.log(`Loaded ${cases.length} eval cases.`);
  for (const c of cases) {
    // TODO: run agent with auto-deny approvals + fixture workspace, then
    // assert each check against the session JSONL and produced draft.
    console.log(`SKIP ${c.id} (${c.checks.length} checks) — harness not implemented yet`);
  }
  console.log("\nImplement check runners before adding new skills (CLAUDE.md rule).");
}

main().catch((err) => {
  console.error("eval run failed:", err);
  process.exit(1);
});
