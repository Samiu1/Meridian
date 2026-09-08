# Decision log

The calls that shape Meridian, with the tradeoff accepted for each and the
condition that should trigger a revisit.

## 1. Local-first, single user

- **Decision:** the product runs on the PM's own machine: local API, local
  web app, local files.
- **Why:** the first milestone is 10 PMs running it weekly, not a hosted
  SaaS. Local-first removes auth, tenancy, and infra from the critical path
  and keeps sensitive inputs (tickets, transcripts) on the user's machine.
- **Tradeoff accepted:** no auth, no sharing, no multi-device.
- **Revisit when:** 10 local users confirm weekly usage. Phase 6 covers the
  hosted path (Clerk, Postgres, single-instance hosting).

## 2. Human approval gate on every external write

- **Decision:** reads and searches run freely; writes and external actions
  block on an explicit approve/decline in the UI.
- **Why:** an agent that files wrong tickets or posts wrong updates under a
  PM's name destroys the trust the product exists to build. Gating is the
  product's core promise, not a feature flag.
- **Tradeoff accepted:** slower, non-autonomous loops.
- **Revisit when:** per-action trust levels make sense (for example,
  auto-approve draft saves) after users build confidence. The eval suite
  pins the gate behavior so it cannot silently loosen.

## 3. JSONL files as the session store

- **Decision:** one append-only JSONL file per session; meta lines carry
  state the model never sees.
- **Why:** auditable by construction (the log is written before streaming),
  trivially inspectable, diffable, and branchable with plain file copies.
- **Tradeoff accepted:** no queries; search is a full-text scan.
- **Revisit when:** session volume makes scans slow, or hosted multi-user
  requires it. Migration path to Postgres is noted in Phase 6.

## 4. Structural eval checks before an LLM judge

- **Decision:** the first eval layer is deterministic code: files read,
  sections present, citations traceable, gates holding. Judgment scoring
  comes later.
- **Why:** structural checks are cheap, reproducible, and catch the failure
  modes that break PM trust (fabricated citations, ungated writes,
  unsurfaced conflicts). A judge that scores prose quality is useless until
  those are pinned.
- **Tradeoff accepted:** output quality is not yet auto-scored; that stays
  manual.
- **Revisit when:** structural coverage is stable; add the judge layer for
  judgment calls (does the Problem section reflect the evidence).

## 5. One wedge skill validated before breadth

- **Decision:** PRD drafting first, used daily by the maintainer, before
  adding more skills. User stories followed only after the wedge held.
- **Why:** ten shallow skills demo well and get used never. One skill a PM
  prefers over writing from scratch is the actual product test.
- **Tradeoff accepted:** a narrower feature list in the short term.
- **Revisit when:** each new skill clears the same bar: daily use plus eval
  coverage. Status updates and release notes are next in Phase 2.

## 6. Connectors behind a stub boundary

- **Decision:** the agent layer talks to `src/extensions/` function
  signatures only; Linear and Slack are stubs behind those signatures.
- **Why:** the agent loop and approval UX are testable end to end without
  external accounts, and swapping stubs for real connectors touches no
  agent code.
- **Tradeoff accepted:** external actions return placeholders until
  Phase 4.
- **Revisit when:** Phase 4 wires real Linear and Slack connectors behind
  the same signatures.

## 7. Keyword skill detection before a classifier

- **Decision:** skill intent is matched by keyword triggers in frontmatter.
- **Why:** with two skills, a classification call adds latency and a failure
  mode to solve a problem that does not exist yet.
- **Tradeoff accepted:** overlapping triggers will eventually misfire.
- **Revisit when:** skill count makes keyword overlap ambiguous; swap in a
  small-model classifier.

## 8. Claude Agent SDK now, provider abstraction later

- **Decision:** the loop is built on the Claude Agent SDK; BYO-LLM
  (OpenRouter, DeepSeek, others) is Phase 3 via a Vercel AI SDK rewrite.
- **Why:** the SDK's built-in tools, session fork/resume, and cost logging
  are free today. Abstracting the model layer before the wedge is validated
  is premature generality.
- **Tradeoff accepted:** Anthropic-only until Phase 3, and the
  re-implementation of built-in tools (~200 lines) lands in that phase.
- **Revisit when:** skills are validated and prospective users without
  Anthropic keys are the adoption blocker.
