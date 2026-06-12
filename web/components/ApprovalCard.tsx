/* ApprovalCard — the gated-write UI. A floating pebble that blocks the run
   until the human decides. Approve sinks in clay; decline in terracotta. */
"use client";

import { useState } from "react";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { resolveApproval, type ApprovalRequest } from "../lib/api";

export function ApprovalCard({ approval }: { approval: ApprovalRequest }) {
  const [state, setState] = useState<"pending" | "approved" | "declined" | "error">("pending");

  const decide = async (approved: boolean) => {
    try {
      await resolveApproval(approval.id, approved);
      setState(approved ? "approved" : "declined");
    } catch {
      setState("error");
    }
  };

  return (
    <Card elevation="float" radius="2xl" padding="md" style={{ margin: "var(--space-5) 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Badge tone="warning" dot>Pending approval</Badge>
        <span className="eyebrow">{approval.toolName}</span>
      </div>
      <pre
        style={{
          marginTop: "var(--space-4)",
          padding: "var(--space-4)",
          borderRadius: "var(--radius-md)",
          background: "var(--surface-sunken)",
          boxShadow: "var(--shadow-neu-inset-sm)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 280,
          overflow: "auto",
        }}
      >
        {JSON.stringify(approval.input, null, 2)}
      </pre>
      {state === "pending" ? (
        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
          <Button variant="sage" onClick={() => decide(true)}>Approve</Button>
          <Button variant="danger" onClick={() => decide(false)}>Decline</Button>
        </div>
      ) : (
        <div style={{ marginTop: "var(--space-4)" }}>
          <Badge tone={state === "approved" ? "success" : state === "declined" ? "danger" : "warning"}>
            {state === "error" ? "Failed — already resolved?" : state}
          </Badge>
        </div>
      )}
    </Card>
  );
}
