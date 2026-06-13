#!/usr/bin/env tsx
/**
 * Interactive setup wizard for Meridian.
 * Run: npm run setup
 */
import { createInterface } from "node:readline/promises";
import { writeFile, readFile, mkdir, access } from "node:fs/promises";
import { stdin, stdout } from "node:process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ENV_PATH = path.join(ROOT, ".env");
const WORKSPACES_DIR = path.join(ROOT, "workspaces");

const rl = createInterface({ input: stdin, output: stdout });

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function ask(question: string, fallback?: string): Promise<string> {
  const suffix = fallback ? ` (${fallback})` : "";
  try {
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    return answer || fallback || "";
  } catch {
    return fallback || "";
  }
}

async function setupEnv(): Promise<void> {
  console.log("\n--- Environment Setup ---\n");

  if (await fileExists(ENV_PATH)) {
    const existing = await readFile(ENV_PATH, "utf8");
    if (existing.includes("ANTHROPIC_API_KEY=sk-")) {
      console.log(".env already configured — skipping.\n");
      return;
    }
  }

  const apiKey = await ask("Anthropic API key (sk-ant-...)");
  if (!apiKey) {
    console.log("Skipped — you can add ANTHROPIC_API_KEY to .env later.\n");
  }

  const template = await readFile(path.join(ROOT, ".env.example"), "utf8");
  const env = template.replace(
    /^ANTHROPIC_API_KEY=.*$/m,
    `ANTHROPIC_API_KEY=${apiKey}`
  );
  await writeFile(ENV_PATH, env, "utf8");
  console.log("Created .env\n");
}

async function setupWorkspace(): Promise<void> {
  console.log("--- Workspace Setup ---\n");

  const id = (await ask("Workspace ID (short slug)", "my-product")).replace(
    /\s+/g,
    "-"
  );
  const wsDir = path.join(WORKSPACES_DIR, id);

  if (await fileExists(path.join(wsDir, "CONTEXT.md"))) {
    console.log(`Workspace "${id}" already exists — skipping.\n`);
    return;
  }

  const product = await ask("What's your product? (one-liner)");
  const metric = await ask("North-star metric?", "Weekly active users");
  const tracker = await ask("Tracker project key (e.g. PROJ)?", "PROJ");
  const trackerUrl = await ask(
    "Tracker URL (optional)?",
    `https://tracker.example.com/${tracker}`
  );

  const context = `# Workspace: ${id}

## Product vision
${product || "A product that solves [problem] for [audience]."}

## North star metric
${metric}

## Conventions & terminology
- PRDs use P0/P1/P2 priority labels.
- Tracker project key: ${tracker}

## Key resources
- Tracker: ${trackerUrl}
`;

  await mkdir(wsDir, { recursive: true });
  await writeFile(path.join(wsDir, "CONTEXT.md"), context, "utf8");
  console.log(`Created workspace "${id}" at workspaces/${id}/CONTEXT.md\n`);
}

async function main(): Promise<void> {
  console.log("\n  Meridian Setup\n");
  console.log("  This wizard creates your .env and first workspace.\n");

  await setupEnv();
  await setupWorkspace();

  console.log("--- Ready ---\n");
  console.log("  Start Meridian:  npm run dev");
  console.log("  Then open:       http://localhost:3001\n");

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
