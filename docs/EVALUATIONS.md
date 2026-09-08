# Evaluations

Repo policy: **no skill ships without eval cases.** The eval suite is how a
skill earns its "Live" badge in the README.

## Philosophy

Two check layers are planned; the first is implemented:

1. **Structural checks (live).** Deterministic code that inspects the
   session lines from a real agent run: which files were read, which
   sections exist in the output, whether citations trace to files the agent
   actually opened, whether gated tools were blocked.
2. **LLM judge (planned).** Judgment calls that regex cannot make, for
   example whether the Problem section faithfully reflects the evidence.
   Deliberately deferred until structural coverage is stable - see
   [DECISIONS.md](DECISIONS.md) #4.

Structural checks are the right first layer because they pin the failure
modes that break PM trust: fabricated citations, unsurfaced conflicts, and
external writes that skip approval.

## Running the suite

```bash
npm run evals                       # full run (calls the model, needs ANTHROPIC_API_KEY)
npm run evals -- --dry-run          # parse + resolve all checks, no model calls
npm run evals -- --case prd-basic   # one case
```

The harness runs the real agent loop against fixture inputs in
`evals/fixtures/` and auto-declines any approval request, so gate behavior
is tested, not bypassed.

## Suite inventory

15 cases, 57 structural checks across two skills.

### PRD writer (10 cases)

| Case | What it guards |
|------|----------------|
| `prd-basic` | Reads all inputs, required sections, citations, flags missing success metric |
| `prd-conflicting-inputs` | Surfaces contradictory tickets before drafting, lists open questions |
| `prd-no-fabrication` | Given no inputs: asks or labels assumptions, invents no citations |
| `gate-external-write` | Ticket creation is attempted only through the gate and blocked when declined |
| `prd-slack-thread` | Slack threads as input, cited as sources |
| `prd-meeting-transcript` | Transcripts as input, decisions/action items cited, risks section |
| `prd-bullet-notes` | Raw notes accepted but missing evidence flagged |
| `prd-large-scope` | Oversized scope detected, split recommended before drafting |
| `prd-resume-session` | Session continuity: refines an existing draft |
| `prd-custom-template` | Workspace-defined PRD template respected |

### User story decomposer (5 cases)

| Case | What it guards |
|------|----------------|
| `stories-from-brief` | Story format, acceptance criteria, priority labels, summary, source traces |
| `stories-from-prd` | PRD decomposition with FEAT-ID traceability |
| `stories-ambiguous-input` | Ambiguity flagged before stories are written |
| `stories-no-input` | No inputs: asks or labels assumptions, still produces format-valid stories |
| `stories-gate-write` | Filing stories as tickets goes through the approval gate |

## Check inventory (`evals/checks.ts`)

Grounding: `reads_all_fixture_files`, `requirement_cites_source`,
`no_invented_citations`, `story_cites_source`, `stories_trace_to_feat_ids`,
`cites_slack_sources`, `cites_meeting_sources`.

PM judgment: `flags_missing_metric`, `flags_missing_evidence`,
`surfaces_conflict_before_drafting`, `detects_scope_too_large`,
`flags_ambiguity_before_stories`, `asks_for_inputs_or_labels_assumptions`.

Structure: `has_section:*`, `has_story_format`,
`stories_have_acceptance_criteria`, `stories_have_priority`.

Safety: `act_create_ticket_blocked_on_approval`,
`no_external_write_without_approval`.

## Verification status

Snapshot from 2026-09-08, on a clean clone:

- `npm run typecheck` (root): pass
- `npm --prefix web run typecheck`: pass
- `npm run evals -- --dry-run`: all 15 cases and 57 checks resolve

Full model-backed runs require an `ANTHROPIC_API_KEY` and are part of the
maintainer's per-phase verification (see ROADMAP.md). The dry run is what
CI should gate on until secrets are available to the runner.

## What's next

- LLM judge layer for judgment checks (design note in `evals/run-evals.ts`).
- Provider matrix: after the Phase 3 BYO-LLM rewrite, run the suite against
  at least two providers.
- More input-variation cases as the skills see daily use (ROADMAP Phase 1).
