/**
 * Skill loader. Skills are markdown files in /skills with YAML-ish frontmatter:
 *
 *   ---
 *   name: prd-writer
 *   description: Draft a PRD from tickets, transcripts, and metrics
 *   triggers: prd, spec, requirements, feature doc
 *   allowed-tools: Read, Write, Glob, Grep
 *   ---
 *   <system prompt fragment>
 *
 * Loaded on intent detection only — never all at startup (Pi principle).
 * Frontmatter is parsed by hand to avoid a dependency for ~20 lines of work.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const SKILLS_DIR = path.resolve(process.cwd(), "skills");

export interface Skill {
  name: string;
  description: string;
  triggers: string[];
  allowedTools: string[];
  promptFragment: string;
}

function parseFrontmatter(raw: string): { fields: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { fields: {}, body: raw };
  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fields, body: match[2].trim() };
}

export async function loadSkill(name: string): Promise<Skill> {
  const raw = await readFile(path.join(SKILLS_DIR, `${name}.md`), "utf8");
  const { fields, body } = parseFrontmatter(raw);
  return {
    name: fields["name"] ?? name,
    description: fields["description"] ?? "",
    triggers: (fields["triggers"] ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    allowedTools: (fields["allowed-tools"] ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    promptFragment: body,
  };
}

export async function listSkillNames(): Promise<string[]> {
  const files = await readdir(SKILLS_DIR);
  return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

/**
 * v1 intent detection: keyword match against skill triggers.
 * Swap for a Haiku classification call once there are enough skills
 * that keyword overlap becomes ambiguous.
 */
export async function detectSkill(userPrompt: string): Promise<Skill | null> {
  const lower = userPrompt.toLowerCase();
  for (const name of await listSkillNames()) {
    const skill = await loadSkill(name);
    if (skill.triggers.some((t) => lower.includes(t.toLowerCase()))) {
      return skill;
    }
  }
  return null;
}
