# Contributing

## Dev setup

```bash
npm install && npm --prefix web install
npm run setup    # creates .env and a workspace
npm run dev      # API :8787 + web :3001
```

Requires Node.js 20+ and `ANTHROPIC_API_KEY` for agent runs and evals.

## Project structure

```
src/agent/        Agent loop, tools, skill loader, session store
src/api/          Hono server, SSE streaming, approval endpoints
src/extensions/   Connector boundary (Linear, Slack stubs today)
web/              Next.js 15 frontend (App Router, React 19)
sessions/         JSONL session logs (auto-created)
skills/           Markdown skill definitions
workspaces/       Per-workspace CONTEXT.md files
evals/            Evaluation dataset, fixtures, and harness
docs/             Architecture, evaluations, decision log
```

## Conventions

- **Log before stream.** Every session line is persisted to JSONL before it
  reaches the client. Never reorder this.
- **Connector boundary.** Agent code never imports a connector SDK. All
  external services go through `src/extensions/` behind stable function
  signatures.
- **Gated writes.** `Write` and every `act_*` tool go through the
  `canUseTool` approval gate. Do not add a write path that skips it.
- **No skill without evals.** A new skill lands with cases in
  `evals/dataset.jsonl` and fixtures in `evals/fixtures/` in the same
  change.
- **Core prompt stays small.** Under 1000 tokens. Workspace specifics go in
  `CONTEXT.md`, task specifics in skills.

## Adding a skill

1. Create `skills/<name>.md` with frontmatter (`name`, `description`,
   `triggers`, `allowed-tools`) and a system prompt fragment. Follow
   `skills/prd-writer.md` as the pattern.
2. Add eval cases and fixtures covering the skill's trust behaviors:
   reads inputs, cites sources, surfaces gaps, respects the gate.
3. Run the verification checklist below.

## Verification checklist

- `npm run typecheck` (root) passes
- `npm --prefix web run typecheck` passes
- `npm run evals` passes (or `--dry-run` plus a note on model-backed runs)
- Manual: fresh clone, `npm run setup`, `npm run dev`, complete one task
  end to end
