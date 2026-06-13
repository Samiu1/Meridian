"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Textarea } from "../components/ui/textarea";
import { ApprovalCard } from "../components/ApprovalCard";
import { TranscriptLine } from "../components/TranscriptLine";
import { WelcomeCard } from "../components/WelcomeCard";
import {
  listSessions,
  startRun,
  type ApprovalRequest,
  type SessionLine,
  type SessionSummary,
} from "../lib/api";

type FeedItem =
  | { kind: "line"; line: SessionLine }
  | { kind: "approval"; approval: ApprovalRequest };

export default function Home() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resume");
  const resumeContext = searchParams.get("context");

  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const feedEnd = useRef<HTMLDivElement>(null);
  const resumeHandled = useRef(false);

  const refreshSessions = useCallback(() => {
    listSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  useEffect(refreshSessions, [refreshSessions]);
  useEffect(
    () => feedEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [feed]
  );

  useEffect(() => {
    if (resumeId && !resumeHandled.current) {
      resumeHandled.current = true;
      setPrompt(
        resumeContext
          ? `Continue: ${resumeContext}`
          : "Continue where we left off."
      );
    }
  }, [resumeId, resumeContext]);

  const run = async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setError(null);
    setFeed([]);
    try {
      for await (const ev of startRun({
        prompt,
        workspaceId: "demo",
        resumeSessionId: resumeId ?? undefined,
      })) {
        if (ev.event === "line") {
          setFeed((f) => [...f, { kind: "line", line: ev.data }]);
        } else if (ev.event === "approval_requested") {
          setFeed((f) => [...f, { kind: "approval", approval: ev.data }]);
        } else if (ev.event === "error") {
          setError(ev.data.message);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "run failed");
    } finally {
      setRunning(false);
      refreshSessions();
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-8 pt-8 pb-32">
      {/* Header */}
      <header className="flex items-baseline justify-between pb-4 border-b">
        <h1 className="text-primary text-2xl italic font-semibold">
          Meridian
        </h1>
        <Badge tone="primary" dot>
          {running ? "Agent working" : "Ready"}
        </Badge>
      </header>

      {/* Composer */}
      <section className="animate-rise mt-10">
        <span className="eyebrow">
          {resumeId ? "Continue session" : "New session"}
        </span>
        <Card className="mt-4">
          <CardContent className="space-y-4">
            <h2 className="text-2xl italic">
              {resumeId
                ? "What should we refine?"
                : "What are we shaping today?"}
            </h2>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                resumeId
                  ? "Add a rollback strategy section..."
                  : "Draft a PRD for CSV export from the notes in drafts/..."
              }
              rows={4}
              className="resize-y"
            />
            <div className="flex items-center justify-between">
              {resumeId && (
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Start new instead
                </Link>
              )}
              <div className="ml-auto">
                <Button
                  size="lg"
                  onClick={run}
                  disabled={running || !prompt.trim()}
                >
                  {running
                    ? "Working..."
                    : resumeId
                      ? "Continue"
                      : "Begin session"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Live feed */}
      {(feed.length > 0 || error) && (
        <section className="mt-10">
          <span className="eyebrow">Live session</span>
          <hr className="my-3 border-border" />
          {feed.map((item, i) =>
            item.kind === "line" ? (
              <TranscriptLine key={i} line={item.line} />
            ) : (
              <ApprovalCard key={item.approval.id} approval={item.approval} />
            )
          )}
          {error && <Badge tone="danger">{error}</Badge>}
          <div ref={feedEnd} />
        </section>
      )}

      {/* Recent sessions */}
      <section className="mt-14">
        <span className="eyebrow">Recent sessions</span>
        <hr className="my-3 border-border" />
        {sessions.length === 0 && feed.length === 0 ? (
          <WelcomeCard />
        ) : sessions.length === 0 ? (
          <p className="text-muted-foreground">
            Your first session will appear here once complete.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/sessions/${s.id}`}
                className="no-underline"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent>
                    <p className="font-serif italic text-base line-clamp-2">
                      {s.firstPrompt}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {typeof s.costUsd === "number" && (
                        <Badge tone="neutral">${s.costUsd.toFixed(3)}</Badge>
                      )}
                      <Badge tone="neutral">{s.lineCount} events</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
