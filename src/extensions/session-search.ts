/**
 * Session discovery for the search_sessions tool. v1 scans local JSONL files;
 * replace with Postgres-backed metadata + full-text search at scale.
 */
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SESSIONS_DIR = path.resolve(process.cwd(), "sessions");

export async function listSessionFiles(): Promise<string[]> {
  if (!existsSync(SESSIONS_DIR)) return [];
  const files = await readdir(SESSIONS_DIR);
  return files.filter((f) => f.endsWith(".jsonl")).map((f) => f.replace(/\.jsonl$/, ""));
}
