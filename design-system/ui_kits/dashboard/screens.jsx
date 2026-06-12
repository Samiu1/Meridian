/* Health Signal — dashboard screens (Overview / Analysis / Trends) */
const HS = window.HealthSignalDesignSystem_f0a9a2;
const ICON = (n) => <i data-lucide={n}></i>;

function OverviewScreen({ data }) {
  const { ScoreRing, MetricTile, Card, Badge } = HS;
  const latest = data.metrics[data.metrics.length - 1];
  const recovery = data.metrics.map((d) => ({ date: d.date, charge: d.body_battery_charge, drain: d.body_battery_drain }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)", gap: 40 }}>
        <Card elevation="flat" radius="4xl" padding="xl" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
          <span className="eyebrow" style={{ letterSpacing: "0.4em" }}>Composite Index</span>
          <ScoreRing value={data.insight.health_score} label="Points" size={244} />
          <Badge look="neu" tone="primary" dot pulse>Stability · High</Badge>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <MetricTile label="Heart Rate" value={latest.resting_heart_rate} unit="BPM" icon={ICON("heart")} iconColor="var(--status-danger)" progress={68} />
          <MetricTile label="Recovery Rank" value={latest.readiness_score} unit="/100" icon={ICON("zap")} iconColor="var(--status-warning)" progress={latest.readiness_score} />
          <MetricTile label="Sleep Efficiency" value={latest.sleep_score} unit="Pts" icon={ICON("moon")} iconColor="var(--color-secondary)" progress={latest.sleep_score} />
          <MetricTile label="Metabolic Load" value={latest.active_calories} unit="kcal" icon={ICON("flame")} iconColor="var(--color-primary)" progress={56} />
        </div>
      </div>

      <section style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <HS.SectionHeader>Recovery Symphony</HS.SectionHeader>
        <Card elevation="flat" radius="3xl" padding="lg" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 36, right: 44, textAlign: "right" }}>
            <div className="eyebrow" style={{ opacity: 0.5 }}>Flux Analysis</div>
            <div style={{ fontSize: 12, fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-primary)", marginTop: 4 }}>Charge vs Drain</div>
          </div>
          <div style={{ paddingTop: 24 }}>
            <AreaChartMini
              data={recovery}
              series={[
                { key: "charge", color: "var(--color-secondary)", label: "Charge" },
                { key: "drain", color: "var(--color-primary)", label: "Drain" },
              ]}
              height={340}
            />
          </div>
        </Card>
      </section>
    </div>
  );
}

function AnalysisScreen({ data }) {
  const { Card, ExpertCard, SectionHeader } = HS;
  const ins = data.insight;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      <Card elevation="flat" radius="4xl" padding="xl">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, color: "var(--color-secondary)" }}>
              <div style={{ display: "inline-flex", padding: 14, borderRadius: "var(--radius-lg)", background: "var(--surface-base)", boxShadow: "var(--shadow-neu-sm)" }}>
                <span style={{ width: 28, height: 28, display: "inline-flex" }}>{ICON("brain")}</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 700, fontSize: 32 }}>Synthesis Report</h2>
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, fontStyle: "italic", lineHeight: 1.5, color: "var(--text-primary)" }}>{ins.summary}</p>
            <p style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 500, color: "var(--text-muted)", borderLeft: "3px solid var(--border-hairline)", paddingLeft: 28 }}>{ins.synthesis_report}</p>
          </div>
          <Card elevation="sm" radius="2xl" padding="lg" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--color-primary)" }}>
              <span style={{ width: 22, height: 22, display: "inline-flex" }}>{ICON("zap")}</span>
              <h3 className="eyebrow" style={{ color: "var(--color-primary)", letterSpacing: "0.2em", fontSize: 12 }}>Tactical Strategy</h3>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 22 }}>
              {ins.recommendations.map((r, i) => (
                <li key={i} style={{ display: "flex", gap: 16 }}>
                  <span style={{ marginTop: 8, width: 7, height: 7, flexShrink: 0, borderRadius: "50%", background: "var(--color-secondary)", boxShadow: "var(--glow-clay)" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: "var(--text-primary)" }}>{r}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Card>

      <section style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <SectionHeader>Multi-Agent Counsel</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {ins.expert_insights.map((e) => (
            <ExpertCard key={e.expert} name={e.expert} icon={ICON(e.icon)} accent={e.accent} analysis={e.analysis} recommendations={e.recommendations} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TrendsScreen({ data }) {
  const { Card, SectionHeader } = HS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionHeader>Signal Trends</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <Card elevation="flat" radius="3xl" padding="lg">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, color: "var(--text-muted)" }}>
            <span style={{ width: 22, height: 22, display: "inline-flex" }}>{ICON("activity")}</span>
            <h3 className="eyebrow" style={{ fontSize: 12 }}>Biometric Flow</h3>
          </div>
          <AreaChartMini data={data.metrics} series={[{ key: "resting_heart_rate", color: "var(--color-primary)", label: "Heart Rate" }]} height={300} />
        </Card>
        <Card elevation="flat" radius="3xl" padding="lg">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, color: "var(--text-muted)" }}>
            <span style={{ width: 22, height: 22, display: "inline-flex" }}>{ICON("brain")}</span>
            <h3 className="eyebrow" style={{ fontSize: 12 }}>Stress Indices</h3>
          </div>
          <BarChartMini data={data.metrics} dataKey="avg_stress" color="var(--color-primary)" height={300} />
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { OverviewScreen, AnalysisScreen, TrendsScreen });
