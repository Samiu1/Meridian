/* Client for the Meridian agent API (Hono, :8787). SSE comes over a POST,
   so we parse the stream from fetch() rather than using EventSource. */

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8787";

export interface SessionSummary {
  id: string;
  firstPrompt: string;
  lastTs: string | null;
  lineCount: number;
  costUsd?: number;
}

export interface SessionLine {
  type: "user" | "assistant" | "tool_call" | "tool_result" | "meta";
  ts: string;
  sessionId: string;
  text?: string;
  toolName?: string;
  toolUseId?: string;
  input?: Record<string, unknown>;
  approved?: boolean;
  kind?: string;
  data?: Record<string, unknown>;
}

export interface ApprovalRequest {
  id: string;
  sessionId: string;
  toolName: string;
  input: Record<string, unknown>;
}

export type StreamEvent =
  | { event: "line"; data: SessionLine }
  | { event: "approval_requested"; data: ApprovalRequest }
  | { event: "done"; data: { sessionId: string } }
  | { event: "error"; data: { message: string } };

export async function listSessions(): Promise<SessionSummary[]> {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error(`list sessions failed: ${res.status}`);
  const body = (await res.json()) as { sessions: SessionSummary[] };
  return body.sessions;
}

export async function getSession(id: string): Promise<SessionLine[]> {
  const res = await fetch(`${API_BASE}/sessions/${id}`);
  if (!res.ok) throw new Error(`get session failed: ${res.status}`);
  const body = (await res.json()) as { lines: SessionLine[] };
  return body.lines;
}

export async function resolveApproval(id: string, approved: boolean): Promise<void> {
  const res = await fetch(`${API_BASE}/approvals/${id}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ approved }),
  });
  if (!res.ok) throw new Error(`approval failed: ${res.status}`);
}

/** Start a run and yield parsed SSE events until the stream closes. */
export async function* startRun(input: {
  prompt: string;
  workspaceId: string;
  resumeSessionId?: string;
  fork?: boolean;
}): AsyncGenerator<StreamEvent> {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok || !res.body) throw new Error(`run failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE messages are separated by a blank line.
    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const raw = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      let event = "message";
      let data = "";
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (data) yield { event, data: JSON.parse(data) } as StreamEvent;
    }
  }
}
