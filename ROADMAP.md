# Meridian Product Roadmap — Local-First SaaS for PMs

## Context

Meridian is a PM agent SaaS built on the Claude Agent SDK. The core loop
(agent, SSE streaming, approval gates, JSONL sessions, PRD skill) works
end-to-end today. The goal is to get 10 PMs running it locally via
clone-and-run, validate the wedge (PRD/spec drafting), then expand.

Current state: the backend and frontend are production-ready for single-user
local use. What's missing is onboarding polish, skill breadth, real
connectors, and multi-LLM support.

---

## Phase 0: Clone-and-Run Ready (Week 1)

**Goal:** Any PM can `git clone` → `npm install` → `npm run dev` and be
productive in under 5 minutes.

- [ ] **Setup wizard CLI** — `npm run setup` interactive script that:
  - Prompts for `ANTHROPIC_API_KEY` (or OpenRouter key later)
  - Creates `.env` from `.env.example`
  - Creates a default workspace with starter `CONTEXT.md` (guided prompts:
    "What's your product?", "What tracker do you use?")
  - Runs both API + web servers together (`concurrently`)
- [ ] **Single `npm run dev` command** — start API (:8787) and web (:3001)
  together from root (use `concurrently` or `npm-run-all`)
- [ ] **First-run welcome screen** — if no sessions exist, show onboarding
  card in the web UI: "Set up your workspace" → edit CONTEXT.md fields
  through a form
- [ ] **README rewrite for end-users** — current README is contributor-facing
  (architecture, decision log). Add a top section: 3-step quickstart,
  screenshot, "what can it do" list. Move architecture docs to `CONTRIBUTING.md`

**Files:** `scripts/setup.ts` (new), `package.json` (root), `web/app/page.tsx`,
`README.md`

---

## Phase 1: Nail the Wedge — PRD Drafting (Weeks 2-3)

**Goal:** PRD skill is good enough that PMs prefer it over writing from
scratch. Validate with your own usage first.

- [ ] **PRD skill refinements** — use it daily, fix prompt issues as they
  surface. Key areas:
  - Input flexibility: handle raw Slack threads, meeting transcripts, bullet
    lists, not just structured tickets
  - Output quality: sections match your org's PRD template (configurable via
    workspace `CONTEXT.md` template field)
  - Edge cases: conflicting requirements, missing stakeholder input,
    scope-too-large detection
- [ ] **Export to Markdown file** — "Save draft" button that writes the PRD
  to a local `drafts/` folder (agent already has `Write` tool, just need
  a UI trigger + file path convention)
- [ ] **Session continuity** — "Continue this PRD" from session list. The
  branch/fork endpoint exists; wire it to a UI button
- [ ] **Eval expansion** — add 6-8 more eval cases covering the input
  variations above. Target: pass rate visible in `npm run evals`

**Files:** `skills/prd-writer.md`, `web/app/page.tsx`, `evals/dataset.jsonl`,
`evals/checks.ts`

---

## Phase 2: Skill Breadth — Three More Skills (Weeks 4-6)

**Goal:** Cover the PM's core writing workflows beyond PRDs. Each skill
ships with eval cases (repo policy).

Priority order (validated with Samiul):

1. **User Story Decomposer** — input: high-level feature brief → output:
   structured user stories with acceptance criteria. Highest leverage:
   PMs do this daily and it's tedious
2. **Stakeholder Update / Status Report** — input: recent tickets, blockers,
   decisions → output: weekly update (email/Slack format)
3. **Release Notes Writer** — input: changelog/diff/tickets closed →
   output: user-facing release notes (internal + external variants)

Each skill follows the pattern in `prd-writer.md`: frontmatter (name,
triggers, allowed-tools) + system prompt fragment. Skill loader already
handles multiple skills via keyword detection.

**Files:** `skills/release-notes.md`, `skills/status-update.md`,
`skills/story-decomposer.md` (new), `evals/dataset.jsonl` (add cases per
skill)

---

## Phase 3: Bring Your Own LLM (Weeks 8-10, after skill validation)

**Goal:** PMs choose their model provider — Claude, DeepSeek, OpenRouter,
etc. Critical for adoption by PMs who don't have Anthropic API keys or
want cheaper options.

- [ ] **Abstract the LLM layer** — replace `@anthropic-ai/claude-agent-sdk`
  `query()` with Vercel AI SDK `generateText()` loop (design already
  documented in this session)
- [ ] **Provider config in `.env`** — `LLM_PROVIDER=anthropic|openrouter|deepseek`,
  `LLM_MODEL=claude-sonnet-4-6`, `LLM_API_KEY=...`
- [ ] **Provider selector in web UI** — settings panel or dropdown in
  composer. Store preference per workspace
- [ ] **Re-implement SDK built-in tools** — `Read`, `Glob`, `Grep`, `Write`
  as local tool functions (these were free with the Agent SDK; need custom
  implementations ~200 lines total)
- [ ] **Update eval harness** — evals should run against the new loop.
  Model-agnostic checks still pass; add a provider matrix test (run evals
  against 2 providers)

**Files:** `src/agent/run-agent.ts` (rewrite), `src/agent/pm-tools.ts`
(refactor tools), `src/agent/providers.ts` (new), `package.json`,
`.env.example`, `web/components/settings-panel.tsx` (new)

---

## Phase 4: Real Connectors — Linear + Slack (Weeks 10-12)

**Goal:** Agent can actually create tickets and post updates instead of
returning fake URLs.

- [ ] **Linear connector** — `src/extensions/linear.ts`. Use Linear SDK.
  OAuth token stored in `.env` (`LINEAR_API_KEY`). Replace
  `createTicket()` stub
- [ ] **Slack connector** — `src/extensions/slack.ts`. Slack Webhook URL
  for posting. Replace `postUpdate()` stub
- [ ] **Connector config in setup wizard** — "Do you use Linear or Jira?"
  → set env vars. Skip if not ready
- [ ] **Approval gate UX improvement** — show rich preview of what will be
  created (ticket title, body, project) before approve/decline

**Files:** `src/extensions/linear.ts` (new), `src/extensions/slack.ts`
(new), `src/extensions/stubs.ts` (remove), `scripts/setup.ts` (update)

---

## Phase 5: Polish for 10 Users (Weeks 12-14)

**Goal:** Smooth enough for 10 PMs to run independently without your
support.

- [ ] **Error handling & recovery** — API key invalid, model rate-limited,
  session file corrupted. Surface clear error messages in UI, not raw
  stack traces
- [ ] **Cost visibility** — per-session cost already logged in JSONL meta.
  Surface it in the UI: session list shows cost, running total in
  composer
- [ ] **Workspace templates** — 2-3 starter CONTEXT.md files: "B2B SaaS",
  "Mobile App", "Platform/API". Selectable during setup
- [ ] **Auto-update mechanism** — `git pull && npm install` script or
  instructions. PMs won't track repo changes manually
- [ ] **Troubleshooting guide** — common issues: port conflicts, API key
  errors, Node version. Link from the web UI's help/settings

---

## Phase 6: Beyond Local — Hosted Version (Week 15+, only after validation)

**Not in scope for first 10 users**, but architectural decisions to make
now to avoid rework:

- Auth (Clerk slot exists)
- Session storage → Postgres (migration path from JSONL)
- Multi-tenant workspace isolation
- Hosting: single Fly.io/Railway instance serves both API + web
- Usage-based billing

**Decision point:** only start this after 10 local users confirm the
value. If PMs aren't using it weekly, hosting won't fix that.

---

## Verification

After each phase:
- `npm run typecheck` passes (root + web)
- `npm run evals` — all cases pass
- Manual test: clone fresh → setup → run → complete a PRD → export
- For Phase 3: run evals against at least 2 LLM providers

## What NOT to build yet

- Mobile app
- Real-time collaboration / multiplayer
- Plugin marketplace
- Custom skill editor UI (PMs edit markdown files directly for now)
- Jira connector (Linear first — simpler API, PM-native)
- Amplitude/analytics connector (no clear use case in v1 skills)
