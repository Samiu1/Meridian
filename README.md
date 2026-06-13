# Meridian

A PM agent that turns raw inputs — tickets, transcripts, docs — into
polished artifacts. PRDs, user stories, release notes, status updates.
Every external write requires your approval before it executes.

## Quickstart

```bash
git clone <repository-url> && cd Meridian

# Install everything
npm install && npm --prefix web install

# Interactive setup — creates .env and your first workspace
npm run setup

# Start both servers (API + web)
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) and type your first prompt.

### What you need

- Node.js 20+
- Anthropic API key (`ANTHROPIC_API_KEY`)

### What Meridian can do today

| Skill | Status | What it does |
|-------|--------|-------------|
| PRD Drafting | Live | Turn raw inputs into structured PRDs with citations |
| User Stories | Coming | Decompose feature briefs into stories with acceptance criteria |
| Status Updates | Coming | Generate stakeholder updates from tickets and blockers |
| Release Notes | Coming | Changelog/diff to user-facing release notes |

## How it works

1. You type a prompt in the web UI
2. The agent reads your workspace context and picks the right skill
3. It streams its work back over SSE — you see every step live
4. External writes (tickets, Slack posts) surface as approval cards — you approve or decline
5. Everything is logged as JSONL in `/sessions` for full auditability

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API (:8787) + web (:3001) together |
| `npm run dev:api` | Start API server only |
| `npm run setup` | Interactive setup wizard |
| `npm run typecheck` | TypeScript check (root) |
| `npm run evals` | Run evaluation harness |
| `npm --prefix web run dev` | Start web app only |
| `npm --prefix web run typecheck` | TypeScript check (web) |

## Project structure

```
src/agent/        Agent loop, tools, skill loader, session store
src/api/          Hono server, SSE streaming, approval endpoints
src/extensions/   External connectors (Linear, Slack — stubs for now)
web/              Next.js 15 frontend (App Router, React 19)
sessions/         JSONL session logs (auto-created)
skills/           Markdown skill definitions
workspaces/       Per-workspace CONTEXT.md files
evals/            Evaluation dataset and harness
```

## Configuring your workspace

Each workspace has a `CONTEXT.md` in `workspaces/<id>/`. The agent reads
this on every run. Include:

- **Product vision** — one-liner
- **North-star metric** — what success looks like
- **Conventions** — priority labels, terminology
- **Key resources** — tracker URL, docs links

The setup wizard creates your first one. Edit it anytime.

## Environment variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `ANTHROPIC_API_KEY` | Yes | — | Claude API key |
| `PM_AGENT_MODEL` | No | `claude-sonnet-4-6` | Model for agent runs |
| `PM_AGENT_MAX_TURNS` | No | `30` | Max agent loop turns |
| `PORT` | No | `8787` | API server port |

## Troubleshooting

**Port conflict:** Change `PORT` in `.env` (API) or edit `web/package.json`
dev script port (web).

**Agent not responding:** Check `ANTHROPIC_API_KEY` in `.env`. If a session
hangs, look for an unapproved action in the UI.

**Stale sessions:** Sessions are JSONL files in `/sessions`. Delete any to
clear history.

---

<details>
<summary>Architecture & contributor docs</summary>

### Request lifecycle

1. User submits prompt via Next.js web app
2. `POST /sessions` hits the Hono API
3. `runAgent()` starts the Agent SDK `query()` loop
4. Tools execute — gated tools emit `approval_requested` over SSE
5. User approves via `POST /approvals/:id`
6. Agent continues; response streams back via SSE
7. Every event persisted to JSONL before streaming

### Agent loop (`src/agent/run-agent.ts`)

Single agent + skills. System prompt = core (<1000 tokens) + workspace
CONTEXT.md + at most one skill fragment. `settingSources: []` for hermetic
runs.

### Tools — four primitives

| Primitive | Gating |
|-----------|--------|
| Read (Glob, Grep) | Auto-allowed |
| Write (drafts) | Human approval |
| Search (past sessions) | Auto-allowed |
| Act (tickets, posts) | Human approval |

### Session format (`/sessions/*.jsonl`)

Line types: `user`, `assistant`, `tool_call`, `tool_result`, `meta`.
Meta lines hold skill state, branch pointers, token usage — never sent
to the model.

### Skills (`/skills/*.md`)

Markdown with YAML frontmatter (name, triggers, allowed-tools) + system
prompt fragment. Loaded on intent detection only.

### Known limitations

- In-memory approval map — single node only (no horizontal scaling yet)
- No auth — Clerk middleware slot exists but isn't wired
- Connectors are stubs — Linear and Slack return placeholder responses
- Session search is full-text scan of JSONL files

</details>
