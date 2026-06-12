/* Meridian home — composer + live run stream + recent sessions.
   Layout follows the design system's dashboard: 1280px container, eyebrow
   section headers over hairlines, pebble cards, serif italic display. */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ApprovalCard } from "../components/ApprovalCard";
import { TranscriptLine } from "../components/TranscriptLine";
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
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const feedEnd = useRef<HTMLDivElement>(null);

  const refreshSessions = useCallback(() => {
    listSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  useEffect(refreshSessions, [refreshSessions]);
  useEffect(() => feedEnd.current?.scrollIntoView({ behavior: "smooth" }), [feed]);

  const run = async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setError(null);
    setFeed([]);
    try {
      for await (const ev of startRun({ prompt, workspaceId: "demo" })) {
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
    <main style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-6) var(--gutter) 120px" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          paddingBottom: "var(--space-4)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <h1 className="text-gradient" style={{ fontSize: "var(--text-xl)", fontStyle: "italic", fontWeight: 600 }}>
          Meridian
        </h1>
        <Badge look="neu" tone="primary" dot>
          {running ? "Agent working" : "Ready"}
        </Badge>
      </header>

      {/* Composer */}
      <section className="rise" style={{ marginTop: "var(--space-7)" }}>
        <span className="eyebrow">New session</span>
        <Card elevation="flat" radius="3xl" padding="lg" style={{ marginTop: "var(--space-4)" }}>
          <h2 style={{ fontSize: "var(--text-2xl)", fontStyle: "italic", marginBottom: "var(--space-4)" }}>
            What are we shaping today?
          </h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Draft a PRD for CSV export from the notes in drafts/…"
            rows={4}
            style={{
              width: "100%",
              padding: "var(--space-4)",
              border: "none",
              borderRadius: "var(--radius-lg)",
              background: "var(--surface-base)",
              boxShadow: "var(--shadow-neu-inset)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              color: "var(--text-primary)",
              resize: "vertical",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-4)" }}>
            <Button size="lg" onClick={run} disabled={running || !prompt.trim()}>
              {running ? "Working…" : "Begin session"}
            </Button>
          </div>
        </Card>
      </section>

      {/* Live feed */}
      {(feed.length > 0 || error) && (
        <section style={{ marginTop: "var(--space-8)" }}>
          <span className="eyebrow">Live session</span>
          <hr className="hairline" style={{ margin: "var(--space-3) 0 var(--space-4)" }} />
          {feed.map((item, i) =>
            item.kind === "line" ? (
              <TranscriptLine key={i} line={item.line} />
            ) : (
              <ApprovalCard key={item.approval.id} approval={item.approval} />
            ),
          )}
          {error && <Badge tone="danger">{error}</Badge>}
          <div ref={feedEnd} />
        </section>
      )}

      {/* Recent sessions */}
      <section style={{ marginTop: "var(--space-10)" }}>
        <span className="eyebrow">Recent sessions</span>
        <hr className="hairline" style={{ margin: "var(--space-3) 0 var(--space-5)" }} />
        {sessions.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>
            Nothing yet. Your first session will appear here.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-5)" }}>
            {sessions.map((s) => (
              <Link key={s.id} href={`/sessions/${s.id}`} style={{ textDecoration: "none" }}>
                <Card elevation="sm" radius="2xl" padding="md" style={{ height: "100%" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "var(--text-md)",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {s.firstPrompt}
                  </p>
                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
                    {typeof s.costUsd === "number" && <Badge tone="neutral">${s.costUsd.toFixed(3)}</Badge>}
                    <Badge tone="neutral">{s.lineCount} events</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
