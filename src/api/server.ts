/**
 * Hono API. Sessions stream as Server-Sent Events; approvals resolve the
 * promise the agent loop is blocked on.
 *
 * v1 has no auth — Clerk middleware goes here before anything ships.
 */
import { serve } from "@hono/node-server";
import { streamSSE } from "hono/streaming";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { pendingApprovals, runAgent } from "../agent/run-agent.js";
import { readSession, branchSession } from "../agent/session-store.js";
import { listSessionFiles } from "../extensions/session-search.js";
import { randomUUID } from "node:crypto";

const app = new Hono();
app.use("*", cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));

/** Session index for the web app: id + first prompt + last activity. */
app.get("/sessions", async (c) => {
  const ids = await listSessionFiles();
  const sessions = await Promise.all(
    ids.map(async (id) => {
      const lines = await readSession(id);
      const firstUser = lines.find((l) => l.type === "user");
      const usage = [...lines].reverse().find((l) => l.type === "meta" && l.kind === "usage");
      return {
        id,
        firstPrompt: firstUser && "text" in firstUser ? firstUser.text : "(empty)",
        lastTs: lines.at(-1)?.ts ?? null,
        lineCount: lines.length,
        costUsd:
          usage && usage.type === "meta" ? (usage.data.totalCostUsd as number | undefined) : undefined,
      };
    }),
  );
  sessions.sort((a, b) => (b.lastTs ?? "").localeCompare(a.lastTs ?? ""));
  return c.json({ sessions });
});

/**
 * POST /sessions { prompt, workspaceId, resumeSessionId?, fork? }
 * Streams session lines and approval requests as SSE until the run completes.
 */
app.post("/sessions", (c) =>
  streamSSE(c, async (stream) => {
    const body = await c.req.json<{
      prompt: string;
      workspaceId: string;
      resumeSessionId?: string;
      fork?: boolean;
    }>();

    try {
      const { sessionId } = await runAgent({
        prompt: body.prompt,
        workspaceId: body.workspaceId,
        resumeSessionId: body.resumeSessionId,
        forkSession: body.fork,
        onLine: (line) =>
          void stream.writeSSE({ event: "line", data: JSON.stringify(line) }),
        onApprovalRequested: (approval) =>
          void stream.writeSSE({ event: "approval_requested", data: JSON.stringify(approval) }),
      });
      await stream.writeSSE({ event: "done", data: JSON.stringify({ sessionId }) });
    } catch (err) {
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({ message: err instanceof Error ? err.message : "agent run failed" }),
      });
    }
  }),
);

/** Approve or deny a gated tool call the agent is waiting on. */
app.post("/approvals/:id", async (c) => {
  const approval = pendingApprovals.get(c.req.param("id"));
  if (!approval) return c.json({ error: "no such pending approval" }, 404);
  const { approved } = await c.req.json<{ approved: boolean }>();
  approval.resolve(approved);
  return c.json({ ok: true });
});

/** Full session transcript (including meta lines, for the sidebar). */
app.get("/sessions/:id", async (c) => {
  const lines = await readSession(c.req.param("id"));
  if (lines.length === 0) return c.json({ error: "not found" }, 404);
  return c.json({ lines });
});

/** Branch a session: copies the JSONL; caller then POSTs /sessions with fork: true. */
app.post("/sessions/:id/branch", async (c) => {
  const childId = randomUUID();
  await branchSession(c.req.param("id"), childId);
  return c.json({ childSessionId: childId });
});

const port = Number(process.env.PORT ?? 8787);
console.log(`pm-agent api on :${port}`);
serve({ fetch: app.fetch, port });
