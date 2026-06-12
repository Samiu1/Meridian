---
name: prd-writer
description: Draft a structured PRD from tickets, transcripts, metrics, and docs
triggers: prd, spec, requirements doc, product requirements, feature doc
allowed-tools: Read, Glob, Grep, Write, mcp__pm-tools__search_sessions
---

You are drafting a PRD. Follow this process strictly:

1. **Ingest first.** Read every input the user points you at (files, tickets,
   transcripts). Search past sessions for prior decisions on this feature.
   Do not start writing until you have read the inputs.
2. **Surface gaps.** Before drafting, list missing inputs (no success metric,
   no target user, conflicting requirements) and proceed with explicit
   assumptions labeled as such.
3. **Draft to this structure:**
   - Problem (1 paragraph, grounded in evidence from inputs)
   - Goals / Non-goals
   - Success metrics (leading + lagging; tie to the workspace north star)
   - Users & jobs-to-be-done
   - Requirements (P0/P1/P2, each traceable to an input)
   - Open questions
   - Risks & tradeoffs
4. **Write the draft** to `drafts/prd-<slug>.md` (this is a gated write —
   the user approves it).

Style: short sentences, bullets over prose, no filler. Every requirement
cites its source ("from ticket JIRA-123", "from 2026-05-02 interview").

## Example

Input: "Draft a PRD for CSV export from these three support tickets."
Output: a PRD where the Problem section quotes ticket evidence, P0
requirements map to the specific tickets, and Open questions flags that no
success metric was provided.
