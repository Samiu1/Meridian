"use client";

import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";

const CAPABILITIES: { label: string; description: string; coming?: boolean }[] = [
  { label: "PRD Drafting", description: "Turn raw inputs into structured PRDs" },
  { label: "User Stories", description: "Decompose features into acceptance-criteria-backed stories", coming: true },
  { label: "Status Updates", description: "Generate stakeholder updates from tickets and blockers", coming: true },
];

export function WelcomeCard() {
  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-2xl italic">Welcome to Meridian</h2>
          <p className="text-muted-foreground mt-2">
            Your PM agent. Type a prompt above to start your first session.
          </p>
        </div>

        <div>
          <span className="eyebrow">What Meridian can do</span>
          <ul className="mt-3 space-y-3">
            {CAPABILITIES.map((cap) => (
              <li key={cap.label} className="flex items-start gap-3">
                <Badge tone={cap.coming ? "neutral" : "primary"} className="mt-0.5 shrink-0">
                  {cap.coming ? "Soon" : "Live"}
                </Badge>
                <div>
                  <span className="font-medium">{cap.label}</span>
                  <span className="text-muted-foreground ml-1.5 text-sm">
                    — {cap.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <span className="eyebrow">Quick start</span>
          <p className="text-sm text-muted-foreground mt-2">
            Try: &ldquo;Draft a PRD for CSV export based on the notes in drafts/csv-export.md&rdquo;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
