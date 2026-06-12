import { Badge } from "./ui/Badge";
import { Card, CardContent } from "./ui/Card";
import type { SessionLine } from "../lib/api";

export function TranscriptLine({ line }: { line: SessionLine }) {
  if (line.type === "user") {
    return (
      <Card className="my-5 bg-muted/50">
        <CardContent>
          <span className="eyebrow">You</span>
          <p className="mt-2 whitespace-pre-wrap">{line.text}</p>
        </CardContent>
      </Card>
    );
  }

  if (line.type === "assistant") {
    return (
      <div className="animate-rise px-2 py-4">
        <span className="eyebrow text-clay-600">Meridian</span>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{line.text}</p>
      </div>
    );
  }

  if (line.type === "tool_call") {
    const gated = line.approved !== undefined;
    return (
      <div className="flex items-center gap-2 py-2">
        <Badge
          tone={gated ? (line.approved ? "success" : "danger") : "neutral"}
          dot
        >
          {line.toolName}
        </Badge>
        {gated && (
          <span className="text-xs text-muted-foreground">
            {line.approved ? "approved" : "declined"}
          </span>
        )}
      </div>
    );
  }

  if (line.type === "meta" && line.kind === "usage") {
    const cost = line.data?.totalCostUsd;
    return (
      <div className="flex gap-3 py-3">
        <Badge tone="info">Run complete</Badge>
        {typeof cost === "number" && (
          <Badge tone="neutral">${cost.toFixed(4)}</Badge>
        )}
      </div>
    );
  }

  if (line.type === "meta" && line.kind === "skill") {
    return (
      <div className="py-2">
        <Badge tone="sage" dot>
          Skill: {String(line.data?.skill ?? "")}
        </Badge>
      </div>
    );
  }

  return null;
}
