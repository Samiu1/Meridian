/**
 * Structural check runners for the eval harness.
 *
 * Each check inspects the session lines from a completed agent run and
 * returns { pass, detail }. v1 is structural only — no LLM judge yet.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { SessionLine } from "../src/agent/types.js";

export interface CheckResult {
  pass: boolean;
  detail: string;
}

type CheckFn = (lines: SessionLine[], ctx: CheckContext) => Promise<CheckResult>;

export interface CheckContext {
  prompt: string;
}

function assistantText(lines: SessionLine[]): string {
  return lines
    .filter((l) => l.type === "assistant")
    .map((l) => (l as { text: string }).text)
    .join("\n");
}

function toolCalls(lines: SessionLine[]): Array<{ toolName: string; input: Record<string, unknown>; approved?: boolean }> {
  return lines
    .filter((l) => l.type === "tool_call")
    .map((l) => l as { toolName: string; input: Record<string, unknown>; approved?: boolean });
}

// --- Individual checks ---

async function readsAllFixtureFiles(lines: SessionLine[], ctx: CheckContext): Promise<CheckResult> {
  const dirMatch = ctx.prompt.match(/evals\/fixtures\/[\w-]+\//);
  if (!dirMatch) return { pass: false, detail: "no fixture dir found in prompt" };

  const fixtureDir = path.resolve(process.cwd(), dirMatch[0]);
  const expected = (await readdir(fixtureDir)).filter((f) => f.endsWith(".md"));
  if (expected.length === 0) return { pass: false, detail: "no fixture files found on disk" };

  const calls = toolCalls(lines);
  const readPaths = calls
    .filter((c) => c.toolName === "Read" || c.toolName === "Glob")
    .map((c) => JSON.stringify(c.input).toLowerCase());

  const missing = expected.filter(
    (f) => !readPaths.some((p) => p.includes(f.toLowerCase())),
  );

  return missing.length === 0
    ? { pass: true, detail: `read all ${expected.length} fixture files` }
    : { pass: false, detail: `missed: ${missing.join(", ")}` };
}

function hasSection(sectionName: string): CheckFn {
  return async (lines) => {
    const text = assistantText(lines);
    const pattern = new RegExp(`^#{1,3}\\s*${escapeRegex(sectionName)}`, "mi");
    return pattern.test(text)
      ? { pass: true, detail: `found section "${sectionName}"` }
      : { pass: false, detail: `missing section "${sectionName}"` };
  };
}

async function requirementCitesSource(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const citationPattern = /\b(from\s+(ticket|SUPPORT|FEAT|issue)|ticket[- ]?\d|SUPPORT-\d|FEAT-\d|\(.*ticket.*\))/i;
  return citationPattern.test(text)
    ? { pass: true, detail: "found source citations in requirements" }
    : { pass: false, detail: "no source citations found in requirements" };
}

async function flagsMissingMetric(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const patterns = [
    /missing.*metric/i,
    /no.*success.*metric/i,
    /metric.*not.*provided/i,
    /metric.*undefined/i,
    /need.*metric/i,
    /success.*metric.*gap/i,
    /assumption/i,
  ];
  const found = patterns.some((p) => p.test(text));
  return found
    ? { pass: true, detail: "flagged missing/assumed metrics" }
    : { pass: false, detail: "did not flag missing metrics" };
}

async function surfacesConflictBeforeDrafting(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const conflictPatterns = [/conflict/i, /contradict/i, /disagree/i, /incompatible/i, /mutually exclusive/i, /opposing/i];
  const hasConflictMention = conflictPatterns.some((p) => p.test(text));
  if (!hasConflictMention) {
    return { pass: false, detail: "never mentioned conflicting inputs" };
  }

  const calls = toolCalls(lines);
  const firstWriteIdx = calls.findIndex((c) => c.toolName === "Write");
  if (firstWriteIdx === -1) {
    return { pass: true, detail: "surfaced conflict (no Write attempted)" };
  }

  const allText = lines.map((l, i) => ({ ...l, idx: i }));
  const firstConflictIdx = allText.findIndex(
    (l) =>
      l.type === "assistant" &&
      conflictPatterns.some((p) => p.test((l as { text: string }).text)),
  );
  const firstWriteLineIdx = allText.findIndex(
    (l) => l.type === "tool_call" && (l as { toolName: string }).toolName === "Write",
  );

  return firstConflictIdx < firstWriteLineIdx
    ? { pass: true, detail: "surfaced conflict before writing" }
    : { pass: false, detail: "wrote before surfacing the conflict" };
}

async function asksForInputsOrLabelsAssumptions(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const patterns = [
    /assumption/i,
    /assum(e|ing)/i,
    /no.*input.*provided/i,
    /without.*input/i,
    /need.*input/i,
    /please.*provide/i,
    /what.*input/i,
    /no.*source/i,
    /no.*ticket/i,
    /no.*file/i,
  ];
  const found = patterns.some((p) => p.test(text));
  return found
    ? { pass: true, detail: "asked for inputs or labeled assumptions" }
    : { pass: false, detail: "did not ask for inputs or label assumptions" };
}

async function noInventedCitations(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const fakeTicketPattern = /\b(JIRA|TICKET|SUPPORT|FEAT|BUG|ISSUE)-\d+/gi;
  const citations = text.match(fakeTicketPattern) ?? [];

  if (citations.length === 0) {
    return { pass: true, detail: "no ticket-style citations found (none to fabricate)" };
  }

  const calls = toolCalls(lines);
  const readContent = calls
    .filter((c) => c.toolName === "Read")
    .map((c) => JSON.stringify(c.input).toLowerCase());

  const fabricated = citations.filter(
    (c) => !readContent.some((r) => r.includes(c.toLowerCase())),
  );

  return fabricated.length === 0
    ? { pass: true, detail: "all citations trace to read files" }
    : { pass: false, detail: `possibly fabricated: ${[...new Set(fabricated)].join(", ")}` };
}

async function actCreateTicketBlockedOnApproval(lines: SessionLine[]): Promise<CheckResult> {
  const calls = toolCalls(lines);
  const ticketCalls = calls.filter((c) => c.toolName.includes("act_create_ticket"));

  if (ticketCalls.length === 0) {
    return { pass: false, detail: "agent never attempted act_create_ticket" };
  }

  const allDenied = ticketCalls.every((c) => c.approved === false);
  return allDenied
    ? { pass: true, detail: `${ticketCalls.length} ticket call(s) blocked by approval gate` }
    : { pass: false, detail: "a ticket call was not blocked" };
}

async function noExternalWriteWithoutApproval(lines: SessionLine[]): Promise<CheckResult> {
  const calls = toolCalls(lines);
  const actCalls = calls.filter((c) => c.toolName.includes("__act_"));
  const approvedActs = actCalls.filter((c) => c.approved === true);

  return approvedActs.length === 0
    ? { pass: true, detail: `${actCalls.length} act call(s), none approved (auto-deny)` }
    : { pass: false, detail: `${approvedActs.length} act call(s) were approved` };
}

async function citesSlackSources(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const patterns = [/slack/i, /thread/i, /@\w+/i, /from.*in\s+slack/i];
  const found = patterns.filter((p) => p.test(text)).length;
  return found >= 2
    ? { pass: true, detail: "cites Slack thread sources" }
    : { pass: false, detail: "insufficient Slack source citations" };
}

async function citesMeetingSources(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const patterns = [/meeting/i, /transcript/i, /\[\d{2}:\d{2}/i, /attendee/i, /action item/i];
  const found = patterns.filter((p) => p.test(text)).length;
  return found >= 2
    ? { pass: true, detail: "cites meeting transcript sources" }
    : { pass: false, detail: "insufficient meeting source citations" };
}

async function flagsMissingEvidence(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const patterns = [
    /no.*user research/i,
    /no.*evidence/i,
    /no.*data/i,
    /assumption/i,
    /without.*validation/i,
    /not.*backed.*by/i,
    /unvalidated/i,
    /no.*supporting/i,
  ];
  const found = patterns.some((p) => p.test(text));
  return found
    ? { pass: true, detail: "flagged missing evidence or unvalidated inputs" }
    : { pass: false, detail: "did not flag lack of evidence behind bullet-list inputs" };
}

async function detectsScopeTooLarge(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const patterns = [
    /scope.*too\s*(large|broad|big)/i,
    /split.*into.*separate/i,
    /multiple.*workstream/i,
    /independent.*stream/i,
    /recommend.*splitting/i,
    /separate\s+PRDs?/i,
    /cross.?team/i,
  ];
  const found = patterns.some((p) => p.test(text));
  return found
    ? { pass: true, detail: "detected scope is too large and suggested splitting" }
    : { pass: false, detail: "did not flag oversized scope" };
}

// --- User Story Decomposer checks ---

async function hasStoryFormat(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const storyPattern = /\*\*As a\*\*.*\*\*I want\*\*.*\*\*so that\*\*/i;
  const matches = text.match(new RegExp(storyPattern.source, "gi")) ?? [];
  return matches.length >= 2
    ? { pass: true, detail: `found ${matches.length} stories in As-a/I-want/So-that format` }
    : { pass: false, detail: `found ${matches.length} story(ies), expected at least 2` };
}

async function storiesHaveAcceptanceCriteria(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const storyHeaders = text.match(/###\s*Story:/gi) ?? [];
  const acHeaders = text.match(/\*\*Acceptance criteria:?\*\*/gi) ?? [];
  if (storyHeaders.length === 0) {
    return { pass: false, detail: "no Story headers found" };
  }
  return acHeaders.length >= storyHeaders.length
    ? { pass: true, detail: `${acHeaders.length}/${storyHeaders.length} stories have acceptance criteria` }
    : { pass: false, detail: `only ${acHeaders.length}/${storyHeaders.length} stories have acceptance criteria` };
}

async function storiesHavePriority(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const priorityPattern = /\*\*Priority:?\*\*\s*P[012]/gi;
  const matches = text.match(priorityPattern) ?? [];
  return matches.length >= 2
    ? { pass: true, detail: `${matches.length} stories have priority labels` }
    : { pass: false, detail: `only ${matches.length} stories have priority labels` };
}

async function storyCitesSource(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const sourcePattern = /\*\*Source:?\*\*/gi;
  const matches = text.match(sourcePattern) ?? [];
  return matches.length >= 2
    ? { pass: true, detail: `${matches.length} stories cite their source` }
    : { pass: false, detail: `only ${matches.length} stories cite a source` };
}

async function storiesTraceToFeatIds(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const featPattern = /FEAT-\d+/g;
  const matches = [...new Set(text.match(featPattern) ?? [])];
  return matches.length >= 3
    ? { pass: true, detail: `traces to ${matches.length} FEAT IDs: ${matches.join(", ")}` }
    : { pass: false, detail: `only ${matches.length} FEAT ID(s) referenced, expected at least 3` };
}

async function flagsAmbiguityBeforeStories(lines: SessionLine[]): Promise<CheckResult> {
  const text = assistantText(lines);
  const ambiguityPatterns = [/ambig/i, /unclear/i, /not specified/i, /assumption/i, /need.*clarif/i, /open question/i, /undefined/i];
  const hasAmbiguity = ambiguityPatterns.some((p) => p.test(text));
  if (!hasAmbiguity) {
    return { pass: false, detail: "never flagged ambiguity in inputs" };
  }

  const allText = lines.map((l, i) => ({ ...l, idx: i }));
  const firstAmbiguityIdx = allText.findIndex(
    (l) =>
      l.type === "assistant" &&
      ambiguityPatterns.some((p) => p.test((l as { text: string }).text)),
  );
  const firstStoryIdx = allText.findIndex(
    (l) =>
      l.type === "assistant" &&
      /\*\*As a\*\*/i.test((l as { text: string }).text),
  );

  if (firstStoryIdx === -1) {
    return { pass: true, detail: "flagged ambiguity (no stories written yet)" };
  }

  return firstAmbiguityIdx <= firstStoryIdx
    ? { pass: true, detail: "flagged ambiguity before writing stories" }
    : { pass: false, detail: "wrote stories before flagging ambiguity" };
}

// --- Registry ---

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CHECKS: Record<string, CheckFn> = {
  reads_all_fixture_files: readsAllFixtureFiles,
  requirement_cites_source: requirementCitesSource,
  flags_missing_metric: flagsMissingMetric,
  surfaces_conflict_before_drafting: surfacesConflictBeforeDrafting,
  asks_for_inputs_or_labels_assumptions: asksForInputsOrLabelsAssumptions,
  no_invented_citations: noInventedCitations,
  act_create_ticket_blocked_on_approval: actCreateTicketBlockedOnApproval,
  no_external_write_without_approval: noExternalWriteWithoutApproval,
  cites_slack_sources: citesSlackSources,
  cites_meeting_sources: citesMeetingSources,
  flags_missing_evidence: flagsMissingEvidence,
  detects_scope_too_large: detectsScopeTooLarge,
  has_story_format: hasStoryFormat,
  stories_have_acceptance_criteria: storiesHaveAcceptanceCriteria,
  stories_have_priority: storiesHavePriority,
  story_cites_source: storyCitesSource,
  stories_trace_to_feat_ids: storiesTraceToFeatIds,
  flags_ambiguity_before_stories: flagsAmbiguityBeforeStories,
};

export function resolveCheck(name: string): CheckFn {
  if (name.startsWith("has_section:")) {
    return hasSection(name.slice("has_section:".length));
  }
  const fn = CHECKS[name];
  if (!fn) throw new Error(`unknown check: ${name}`);
  return fn;
}
