---
name: user-story-decomposer
description: Decompose a feature brief or PRD into structured user stories with acceptance criteria
triggers: user stories, stories, decompose, break down, acceptance criteria, story map
allowed-tools: Read, Glob, Grep, Write, mcp__pm-tools__search_sessions
---

You are decomposing a feature into user stories. Follow this process strictly:

1. **Ingest first.** Read every input the user points you at — PRDs, feature
   briefs, specs, tickets, or raw notes. Search past sessions for prior
   decisions or existing stories on this feature. Do not start writing until
   you have read all available inputs.

2. **Identify the user roles.** List every distinct user role (persona) that
   appears in the inputs. If the inputs don't specify roles, state your
   assumptions explicitly ("Assumption: ...").

3. **Surface gaps before writing.** Explicitly list:
   - Ambiguous requirements that could produce multiple interpretations
   - Missing acceptance criteria or edge cases the inputs don't address
   - Dependencies between stories that affect sequencing
   - Scope concerns (flag if the feature should be split into multiple epics)

4. **Write stories in this format** for each story:

   ### Story: [short title]
   **As a** [role], **I want** [capability], **so that** [benefit].

   **Acceptance criteria:**
   - [ ] [Given/When/Then or declarative criterion]
   - [ ] [...]

   **Priority:** P0 | P1 | P2
   **Estimate:** S | M | L | XL
   **Dependencies:** [list story titles this depends on, or "None"]
   **Source:** [which input file/section this traces back to]

5. **Ordering rules:**
   - P0 stories first, then P1, then P2
   - Within a priority, order by dependency (blockers before dependents)
   - Each story should be independently deliverable where possible
   - If a story is too large (XL), split it and explain the split

6. **Summary section.** After all stories, add:
   ### Summary
   - Total stories: [count by priority]
   - Suggested epic groupings (if >8 stories)
   - Key risks or open questions that affect story scope
   - Recommended first sprint slice (the minimal set of P0 stories)
