/* Renders one session line in the transcript. User turns sit in inset wells,
   assistant prose on open paper, tool calls as small chips with eyebrows. */
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import type { SessionLine } from "../lib/api";

export function TranscriptLine({ line }: { line: SessionLine }) {
  if (line.type === "user") {
    return (
      <Card elevation="inset" radius="xl" padding="md" style={{ margin: "var(--space-5) 0" }}>
        <span className="eyebrow">You</span>
        <p style={{ marginTop: "var(--space-2)", whiteSpace: "pre-wrap" }}>{line.text}</p>
      </Card>
    );
  }

  if (line.type === "assistant") {
    return (
      <div className="rise" style={{ padding: "var(--space-4) var(--space-2)" }}>
        <span className="eyebrow" style={{ color: "var(--clay-600)" }}>Meridian</span>
        <p style={{ marginTop: "var(--space-2)", whiteSpace: "pre-wrap", lineHeight: "var(--leading-relaxed)" }}>
          {line.text}
        </p>
      </div>
    );
  }

  if (line.type === "tool_call") {
    const gated = line.approved !== undefined;
    return (
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", padding: "var(--space-2) 0" }}>
        <Badge tone={gated ? (line.approved ? "success" : "danger") : "neutral"} dot>
          {line.toolName}
        </Badge>
        {gated && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            {line.approved ? "approved" : "declined"}
          </span>
        )}
      </div>
    );
  }

  if (line.type === "meta" && line.kind === "usage") {
    const cost = line.data?.totalCostUsd;
    return (
      <div style={{ display: "flex", gap: "var(--space-3)", padding: "var(--space-3) 0" }}>
        <Badge tone="info">Run complete</Badge>
        {typeof cost === "number" && <Badge tone="neutral">${cost.toFixed(4)}</Badge>}
      </div>
    );
  }

  if (line.type === "meta" && line.kind === "skill") {
    return (
      <div style={{ padding: "var(--space-2) 0" }}>
        <Badge tone="sage" dot>Skill: {String(line.data?.skill ?? "")}</Badge>
      </div>
    );
  }

  return null;
}
