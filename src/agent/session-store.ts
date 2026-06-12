/**
 * JSONL session persistence. One file per session under /sessions.
 * Branching: a branch copies the parent log and records a `meta` branch
 * pointer; the SDK fork (resume + forkSession) carries the model context.
 */
import { appendFile, mkdir, readFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { MetaLine, SessionLine } from "./types.js";

const SESSIONS_DIR = path.resolve(process.cwd(), "sessions");

function sessionPath(sessionId: string): string {
  // sessionId is a UUID from the SDK; guard against path traversal anyway
  if (!/^[A-Za-z0-9-]+$/.test(sessionId)) {
    throw new Error(`invalid session id: ${sessionId}`);
  }
  return path.join(SESSIONS_DIR, `${sessionId}.jsonl`);
}

export async function appendLine(line: SessionLine): Promise<void> {
  await mkdir(SESSIONS_DIR, { recursive: true });
  await appendFile(sessionPath(line.sessionId), JSON.stringify(line) + "\n");
}

export async function readSession(sessionId: string): Promise<SessionLine[]> {
  const file = sessionPath(sessionId);
  if (!existsSync(file)) return [];
  const raw = await readFile(file, "utf8");
  return raw
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as SessionLine);
}

/** Conversation lines only — meta lines are sidebar state, never model input. */
export async function readConversation(sessionId: string): Promise<SessionLine[]> {
  return (await readSession(sessionId)).filter((l) => l.type !== "meta");
}

export async function branchSession(
  parentSessionId: string,
  childSessionId: string,
): Promise<void> {
  await copyFile(sessionPath(parentSessionId), sessionPath(childSessionId));
  const pointer: MetaLine = {
    type: "meta",
    kind: "branch",
    ts: new Date().toISOString(),
    sessionId: childSessionId,
    data: { parentSessionId },
  };
  await appendLine(pointer);
}
