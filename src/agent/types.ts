/**
 * Session JSONL schema.
 * One line per entry. `meta` lines are sidebar state only — NEVER sent to the model.
 * Do not change this schema without updating session-store.ts parsing.
 */

export type SessionLineType =
  | "user"
  | "assistant"
  | "tool_call"
  | "tool_result"
  | "meta";

export interface SessionLineBase {
  type: SessionLineType;
  ts: string; // ISO 8601
  sessionId: string;
}

export interface UserLine extends SessionLineBase {
  type: "user";
  text: string;
}

export interface AssistantLine extends SessionLineBase {
  type: "assistant";
  text: string;
}

export interface ToolCallLine extends SessionLineBase {
  type: "tool_call";
  toolName: string;
  toolUseId: string;
  input: Record<string, unknown>;
  approved?: boolean; // present for gated (write) tools
}

export interface ToolResultLine extends SessionLineBase {
  type: "tool_result";
  toolUseId: string;
  isError: boolean;
  output: string;
}

export interface MetaLine extends SessionLineBase {
  type: "meta";
  kind: "skill" | "branch" | "workspace" | "usage";
  data: Record<string, unknown>;
}

export type SessionLine =
  | UserLine
  | AssistantLine
  | ToolCallLine
  | ToolResultLine
  | MetaLine;

export interface PendingApproval {
  id: string;
  sessionId: string;
  toolName: string;
  input: Record<string, unknown>;
  resolve: (approved: boolean) => void;
}
