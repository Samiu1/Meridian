/**
 * Custom PM tools exposed to the agent as an in-process MCP server.
 * Read/Write/Glob/Grep are the SDK's built-in tools; these add the
 * Search (past sessions) and Act (external writes) primitives.
 *
 * Act tools are write-gated: canUseTool in run-agent.ts holds them for
 * human approval. Connector implementations live in /src/extensions —
 * never inline connector logic here.
 */
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { readSession } from "./session-store.js";
import { listSessionFiles } from "../extensions/session-search.js";
import { createTicket, postUpdate } from "../extensions/stubs.js";

const searchSessions = tool(
  "search_sessions",
  "Search past agent sessions for prior decisions, drafts, and context. " +
    "Call this when the user references earlier work ('the PRD we drafted last week', 'what did we decide about X').",
  { query: z.string().describe("Keywords to search for") },
  async ({ query }) => {
    const hits: string[] = [];
    for (const sessionId of await listSessionFiles()) {
      const lines = await readSession(sessionId);
      const text = lines
        .filter((l) => l.type === "user" || l.type === "assistant")
        .map((l) => ("text" in l ? l.text : ""))
        .join("\n");
      if (text.toLowerCase().includes(query.toLowerCase())) {
        hits.push(`session ${sessionId}: ${text.slice(0, 300)}…`);
      }
    }
    return {
      content: [
        {
          type: "text" as const,
          text: hits.length ? hits.slice(0, 5).join("\n---\n") : "No matching sessions.",
        },
      ],
    };
  },
  { annotations: { readOnlyHint: true } },
);

const actCreateTicket = tool(
  "act_create_ticket",
  "Create a ticket in the workspace's tracker (Jira/Linear). Requires human approval before it executes.",
  {
    title: z.string(),
    body: z.string(),
    project: z.string().describe("Tracker project key from CONTEXT.md"),
  },
  async (input) => {
    const url = await createTicket(input);
    return { content: [{ type: "text" as const, text: `Created: ${url}` }] };
  },
);

const actPostUpdate = tool(
  "act_post_update",
  "Post an update to a Slack channel or webhook. Requires human approval before it executes.",
  {
    channel: z.string(),
    message: z.string(),
  },
  async (input) => {
    await postUpdate(input);
    return { content: [{ type: "text" as const, text: `Posted to ${input.channel}` }] };
  },
);

/** Tool name prefix that the approval gate keys on. */
export const ACT_TOOL_PREFIX = "mcp__pm-tools__act_";

export const pmToolsServer = createSdkMcpServer({
  name: "pm-tools",
  version: "0.1.0",
  tools: [searchSessions, actCreateTicket, actPostUpdate],
});
