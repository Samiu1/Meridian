---
name: prd-writer
description: Draft a structured PRD from tickets, transcripts, metrics, and docs
triggers: prd, spec, requirements doc, product requirements, feature doc
allowed-tools: Read, Glob, Grep, Write, mcp__pm-tools__search_sessions
---

You are drafting a PRD. Follow this process strictly:

1. **Ingest first.** Read every input the user points you at — files, tickets,
   Slack threads, meeting transcripts, bullet lists, or raw notes. Search past
   sessions for prior decisions on this feature. Do not start writing until you
   have read all available inputs.

2. **Surface gaps.** Before drafting, explicitly list:
   - Missing inputs (no success metric, no target user, no technical constraints)
   - Conflicting requirements across sources
   - Assumptions you are making (label each as "Assumption: ...")
   Proceed only after surfacing these.

3. **Draft to this structure** (adapt headings if the workspace CONTEXT.md
   specifies a custom PRD template under `## PRD template`):
   - Problem (1 paragraph, grounded in evidence from inputs)
   - Goals / Non-goals
   - Success metrics (leading + lagging; tie to the workspace north star)
   - Users & jobs-to-be-done
   - Requirements (P0/P1/P2, each traceable to an input)
   - Open questions
   - Risks & tradeoffs

4. **Write the draft** to `drafts/prd-<slug>.md` (this is a gated write —
   the user approves it).

## Input handling

- **Tickets** (Markdown files with IDs like SUPPORT-101, FEAT-42): extract the
  ID as the citation key.
- **Slack threads** (pasted conversations with timestamps/usernames): treat each
  message as a source; cite as "from [user] in Slack thread".
- **Meeting transcripts** (timestamped dialogue): extract decisions, action
  items, and requirements; cite as "from [date] meeting".
- **Bullet lists / raw notes**: treat as requirements input; flag if there is no
  supporting evidence or user research.
- **No inputs provided**: do NOT fabricate sources. Ask the user for inputs,
  or proceed with clearly labeled assumptions.

## Style

Short sentences, bullets over prose, no filler. Every requirement cites its
source ("from ticket SUPPORT-123", "from 2026-05-02 meeting", "from @alice
in Slack thread"). Use the workspace's priority labels (P0/P1/P2 by default).

## Scope detection

If the inputs suggest a scope larger than a single feature (multiple
independent workstreams, cross-team dependencies), flag this before drafting
and suggest splitting into separate PRDs.

## Example

Input: "Draft a PRD for CSV export from these three support tickets."
Output: a PRD where the Problem section quotes ticket evidence, P0
requirements map to the specific tickets, and Open questions flags that no
success metric was provided.
