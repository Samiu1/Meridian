"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TranscriptLine } from "@/components/TranscriptLine";
import { exportSession, getSession, type SessionLine } from "@/lib/api";

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [lines, setLines] = useState<SessionLine[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportedTo, setExportedTo] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getSession(id)
      .then(setLines)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "failed to load session")
      );
  }, [id]);

  const firstPrompt =
    lines?.find((l) => l.type === "user" && "text" in l)?.text ?? "";
  const visible = (lines ?? []).filter(
    (l) => l.type !== "meta" || l.kind === "usage" || l.kind === "skill"
  );

  const doExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const path = await exportSession(id);
      setExportedTo(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-8 pt-8 pb-32">
      <header className="flex items-baseline justify-between pb-4 border-b">
        <h1 className="text-primary text-2xl italic font-semibold">
          <Link href="/" className="no-underline">
            Meridian
          </Link>
        </h1>
        <Badge tone="primary" dot>
          Session
        </Badge>
      </header>

      <section className="animate-rise mt-8">
        <span className="eyebrow">Transcript</span>
        <p className="mt-3 font-serif italic text-lg line-clamp-2">
          {firstPrompt || id}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Link
            href={`/?resume=${encodeURIComponent(id)}${
              firstPrompt
                ? `&context=${encodeURIComponent(firstPrompt.slice(0, 120))}`
                : ""
            }`}
          >
            <Button size="sm">Continue this session</Button>
          </Link>
          <Button size="sm" variant="outline" onClick={doExport} disabled={exporting}>
            {exporting ? "Exporting..." : "Export draft"}
          </Button>
          {exportedTo && <Badge tone="success">Saved to {exportedTo}</Badge>}
        </div>
      </section>

      <section className="mt-8">
        <hr className="my-3 border-border" />
        {error && <Badge tone="danger">{error}</Badge>}
        {lines === null && !error && (
          <p className="text-muted-foreground">Loading session...</p>
        )}
        {lines !== null && visible.length === 0 && !error && (
          <p className="text-muted-foreground">No transcript lines.</p>
        )}
        {visible.map((line, i) => (
          <TranscriptLine key={i} line={line} />
        ))}
      </section>
    </main>
  );
}
