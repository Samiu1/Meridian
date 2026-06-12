"use client";

import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { resolveApproval, type ApprovalRequest } from "../lib/api";

export function ApprovalCard({ approval }: { approval: ApprovalRequest }) {
  const [state, setState] = useState<
    "pending" | "approved" | "declined" | "error"
  >("pending");

  const decide = async (approved: boolean) => {
    try {
      await resolveApproval(approval.id, approved);
      setState(approved ? "approved" : "declined");
    } catch {
      setState("error");
    }
  };

  return (
    <Card className="my-5 shadow-md">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge tone="warning" dot>
            Pending approval
          </Badge>
          <span className="eyebrow">{approval.toolName}</span>
        </div>

        <pre className="rounded-md bg-muted p-4 font-mono text-xs whitespace-pre-wrap break-words max-h-[280px] overflow-auto">
          {JSON.stringify(approval.input, null, 2)}
        </pre>

        {state === "pending" ? (
          <div className="flex gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={() => decide(true)}
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => decide(false)}
            >
              Decline
            </Button>
          </div>
        ) : (
          <Badge
            tone={
              state === "approved"
                ? "success"
                : state === "declined"
                  ? "danger"
                  : "warning"
            }
          >
            {state === "error" ? "Failed — already resolved?" : state}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
