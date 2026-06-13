/**
 * Core agent loop: a wrapper around the Agent SDK's query().
 *
 * Responsibilities:
 *  - assemble the system prompt (core <1000 tokens + CONTEXT.md + skill fragment)
 *  - gate Act/Write tools behind human approval (canUseTool)
 *  - log every event to the session JSONL BEFORE streaming to the client
 *  - enforce turn/budget caps and log token usage per session
 */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { detectSkill } from "./skill-loader.js";
import { appendLine } from "./session-store.js";
import { ACT_TOOL_PREFIX, pmToolsServer } from "./pm-tools.js";
import type { PendingApproval, SessionLine } from "./types.js";

const DEFAULT_MODEL = process.env.PM_AGENT_MODEL ?? "claude-sonnet-4-6";
const MAX_TURNS = Number(process.env.PM_AGENT_MAX_TURNS ?? 30);

// Pi principle: keep this under 1000 tokens. Workspace specifics live in
// CONTEXT.md; task specifics live in skills. Nothing else goes here.
const CORE_SYSTEM_PROMPT = `You are a product-management agent. You help PMs turn raw inputs
(tickets, transcripts, metrics, docs) into crisp artifacts (PRDs, specs, release notes, updates).

Principles:
- Ground every claim in a source you actually read; cite the file or ticket.
- Drafts are deliverables: structured headings, no filler, tradeoffs stated.
- External writes (tickets, posts) are proposals — a human approves each one.
- If inputs are missing or contradictory, say so and list what you need.`;

/** In-memory registry of approvals awaiting a human decision, keyed by id. */
export const pendingApprovals = new Map<string, PendingApproval>();

export interface RunInput {
  prompt: string;
  workspaceId: string;
  resumeSessionId?: string;
  forkSession?: boolean;
  /** Called when a gated tool needs approval; UI surfaces it. */
  onApprovalRequested: (approval: Omit<PendingApproval, "resolve">) => void;
  /** Called for every session line, after it has been persisted. */
  onLine: (line: SessionLine) => void;
}

async function loadWorkspaceContext(workspaceId: string): Promise<string> {
  const file = path.resolve(process.cwd(), "workspaces", workspaceId, "CONTEXT.md");
  return existsSync(file) ? await readFile(file, "utf8") : "";
}

export async function runAgent(input: RunInput): Promise<{ sessionId: string }> {
  const skill = await detectSkill(input.prompt);
  const context = await loadWorkspaceContext(input.workspaceId);

  const systemPrompt = [
    CORE_SYSTEM_PROMPT,
    context && `<workspace_context>\n${context}\n</workspace_context>`,
    skill && `<skill name="${skill.name}">\n${skill.promptFragment}\n</skill>`,
  ]
    .filter(Boolean)
    .join("\n\n");

  let sessionId = input.resumeSessionId ?? "pending";
  type LogInput = SessionLine extends infer L
    ? L extends SessionLine
      ? Omit<L, "ts" | "sessionId">
      : never
    : never;
  const log = async (line: LogInput) => {
    const full = { ...line, ts: new Date().toISOString(), sessionId } as SessionLine;
    await appendLine(full); // always log before streaming to the client
    input.onLine(full);
  };

  const q = query({
    prompt: input.prompt,
    options: {
      model: DEFAULT_MODEL,
      systemPrompt,
      maxTurns: MAX_TURNS,
      resume: input.resumeSessionId,
      forkSession: input.forkSession,
      settingSources: [], // hermetic: no user/project filesystem settings
      mcpServers: { "pm-tools": pmToolsServer },
      allowedTools: [
        "Read",
        "Glob",
        "Grep",
        "mcp__pm-tools__search_sessions",
      ],
      // HITL gate: reads auto-approved above; Write and act_* tools block
      // here until a human approves via the API.
      canUseTool: async (toolName, toolInput) => {
        const needsApproval =
          toolName === "Write" || toolName.startsWith(ACT_TOOL_PREFIX);
        if (!needsApproval) {
          return { behavior: "allow" as const, updatedInput: toolInput };
        }
        const approvalId = randomUUID();
        const approved = await new Promise<boolean>((resolve) => {
          const approval: PendingApproval = {
            id: approvalId,
            sessionId,
            toolName,
            input: toolInput as Record<string, unknown>,
            resolve,
          };
          pendingApprovals.set(approvalId, approval);
          input.onApprovalRequested({ id: approvalId, sessionId, toolName, input: approval.input });
        });
        pendingApprovals.delete(approvalId);
        await log({ type: "tool_call", toolName, toolUseId: approvalId, input: toolInput as Record<string, unknown>, approved });
        return approved
          ? { behavior: "allow" as const, updatedInput: toolInput }
          : { behavior: "deny" as const, message: "User declined this action." };
      },
    },
  });

  let initialized = false;
  for await (const message of q) {
    if (message.type === "system" && "session_id" in message && !initialized) {
      initialized = true;
      sessionId = message.session_id as string;
      if (skill) {
        await log({ type: "meta", kind: "skill", data: { skill: skill.name } });
      }
      await log({ type: "user", text: input.prompt });
    } else if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") {
          await log({ type: "assistant", text: block.text });
        } else if (block.type === "tool_use") {
          await log({
            type: "tool_call",
            toolName: block.name,
            toolUseId: block.id,
            input: block.input as Record<string, unknown>,
          });
        }
      }
    } else if (message.type === "result") {
      // Cost attribution: token usage + spend per session.
      await log({
        type: "meta",
        kind: "usage",
        data: {
          subtype: message.subtype,
          numTurns: message.num_turns,
          totalCostUsd: message.total_cost_usd,
          usage: message.usage,
        },
      });
    }
  }

  return { sessionId };
}
