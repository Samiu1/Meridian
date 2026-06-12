# PM Agent SaaS

## What this is
An agent SaaS for product managers, built on the Claude Agent SDK
(`@anthropic-ai/claude-agent-sdk`). Inspired by Pi's minimal-core philosophy:
few primitives, skill-based extension, transparent session logging.

**v1 wedge: PRD/spec drafting.** One workflow, nailed, with evals — before
broadening to the other skills.

## Stack
- Runtime: TypeScript, Node 20+ (ESM, `tsx` for dev)
- Agent: `@anthropic-ai/claude-agent-sdk` — `query()` loop in `src/agent/run-agent.ts`
- Model: `claude-sonnet-4-6` default (`PM_AGENT_MODEL` env); escalate complex runs to `claude-opus-4-8`
- Storage: JSONL session files in `/sessions` + Postgres later (user/workspace metadata)
- API: Hono (`src/api/server.ts`), SSE streaming
- Auth: Clerk (not wired yet — middleware slot marked in server.ts)
- Frontend: Next.js 15 / React 19 in `web/` (Japandi design system)

## Commands
```bash
# API (repo root)
npm run dev        # API server with watch, :8787
npm run typecheck  # tsc --noEmit
npm run evals      # eval harness (skeleton)

# Web app (web/)
npm --prefix web run dev        # Next.js, :3000 (use -p 3001 if 3000 is taken)
npm --prefix web run typecheck  # tsc --noEmit
```

## Web app (`web/`)
Next.js 15 (App Router, React 19) front end for the agent. Talks to the Hono
API over HTTP + SSE (`web/lib/api.ts`, `NEXT_PUBLIC_API_BASE`, default :8787).
- Styled with the **Japandi / soft-neumorphic design system** vendored under
  `/design-system` (a Claude Design export). Tokens are copied verbatim into
  `web/app/tokens/*.css` and imported by `web/app/globals.css` — edit tokens
  there, not the design-system reference copy.
- Components (`web/components/ui/`): `Card` (neumorphic pebble), `Button`
  (raised→inset press), `Badge`. Production TSX ports of the prototype JSX in
  `design-system/components` — match visual output, don't copy internals.
- Screens: `app/page.tsx` (composer + live SSE feed + recent sessions),
  `app/sessions/[id]/page.tsx` (read-only transcript). The **approval gate**
  surfaces as `ApprovalCard` — a floating pebble that POSTs `/approvals/:id`.
- Design rules (keep): warm paper ground, clay/taupe/sage palette (never
  neon/blue/purple), Lora serif italic for display + big numerals, Raleway 900
  ALL-CAPS eyebrow labels, oversized radii, shadow-only cards (no borders),
  one calm easing `--ease-japandi`, no emoji in UI.

## `/design-system`
Read-only reference bundle: `readme.md` (full brand guide), `guidelines/`
specimen cards, `components/` & `ui_kits/` prototype JSX, `screenshots/`,
`SOURCE-README.md`. The live tokens are the copies in `web/app/tokens/`.

## Architecture

### Agent loop (`src/agent/run-agent.ts`)
Single agent + skills (no orchestrator/workers). One `query()` call per run:
- System prompt = core prompt (<1000 tokens, frozen) + workspace `CONTEXT.md`
  + at most one skill fragment. Nothing else goes in the system prompt.
- `settingSources: []` — runs are hermetic; no filesystem settings leak in.
- Branching = SDK `resume` + `forkSession: true`, plus a JSONL copy with a
  `meta` branch pointer (`session-store.ts`).

### Tools — four primitives
| Primitive | Implementation | Gating |
|---|---|---|
| Read | SDK built-ins `Read`/`Glob`/`Grep` | auto-allowed |
| Write | SDK built-in `Write` (drafts) | **human approval** |
| Search | `mcp__pm-tools__search_sessions` (`src/agent/pm-tools.ts`) | auto-allowed |
| Act | `mcp__pm-tools__act_*` (tickets, posts) | **human approval** |

Approval gate lives in `canUseTool`: gated calls block on a promise in
`pendingApprovals`; the UI resolves it via `POST /approvals/:id`. **Every
external write goes through this gate — never add an act tool that bypasses it.**

### Skills (`/skills/*.md`)
Markdown with frontmatter (`name`, `description`, `triggers`, `allowed-tools`)
+ a system-prompt fragment body. Loaded on intent detection only
(`skill-loader.ts`, keyword match v1) — never all at startup.

### Session format (`/sessions/*.jsonl`)
One line per entry: `user | assistant | tool_call | tool_result | meta`
(types in `src/agent/types.ts`). `meta` lines hold skill state, branch
pointers, and per-session token usage/cost — **never sent to the model**.
Every tool call is logged for auditability, and lines are persisted
**before** streaming to the client.

### Workspace context (`/workspaces/{id}/CONTEXT.md`)
Vision, north-star metric, conventions, links. The only workspace-specific
content in the system prompt.

### Connectors (`/src/extensions`)
Jira/Confluence/Slack/Amplitude live here behind plain function signatures
(`stubs.ts` for now). Agent core never imports connector SDKs directly.

## Cost & safety
- Every run: `maxTurns` cap (`PM_AGENT_MAX_TURNS`, default 30); token usage
  and `total_cost_usd` logged per session as a `meta` usage line.
- Agent SDK usage is metered separately from interactive Claude Code as of
  June 15 2026 — keep per-session cost attribution accurate.
- Failure mode is "embarrassing, not destructive": worst case is a bad draft
  or wrong ticket. Approval gates + the audit log are the mitigation.

## What Claude Code should NOT do
- Do not add a skill without eval cases in `/evals/dataset.jsonl`
- Do not modify the session JSONL schema without updating `types.ts` and `session-store.ts`
- Do not add npm dependencies without checking bundle/install impact
- Do not write connector logic in `/src/agent` — extensions only
- Do not grow the core system prompt past ~1000 tokens
