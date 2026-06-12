/* Health Signal — dashboard shell (header, settings/login, tab nav) */
const { useState, useEffect } = React;
const NS = window.HealthSignalDesignSystem_f0a9a2;

function SettingsPopover({ onClose, demo, setDemo, onConnected }) {
  const { Button, Input, Badge } = NS;
  const [stage, setStage] = useState("initial"); // initial | login | mfa
  const [email, setEmail] = useState("");
  const [connected, setConnected] = useState(false);

  return (
    <div style={{ position: "absolute", right: 0, top: 64, width: 300, zIndex: 60 }}>
      <div className="neu-flat" style={{ borderRadius: "var(--radius-xl)", padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-hairline)", paddingBottom: 14 }}>
          <span className="eyebrow" style={{ letterSpacing: "0.3em" }}>Configuration</span>
        </div>

        {stage === "initial" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, fontStyle: "italic", lineHeight: 1.6, color: "var(--text-muted)", opacity: 0.8, margin: 0 }}>
              Experience the full insight dashboard with simulated biometric streams, or sync live from Garmin.
            </p>
            <Button variant="secondary" size="sm" fullWidth iconLeft={<i data-lucide="activity"></i>} onClick={() => setStage("login")}>Connect Garmin</Button>
            <Button variant="secondary" size="sm" fullWidth iconLeft={<i data-lucide="refresh-cw"></i>}>Sync Health Data</Button>
            {connected && <div style={{ textAlign: "center" }}><Badge tone="success" dot>Connected · {email}</Badge></div>}
            <Button variant={demo ? "secondary" : "primary"} size="sm" fullWidth onClick={() => { setDemo(!demo); onClose(); }}>
              {demo ? "Switch to Live Data" : "Sync Mock Data"}
            </Button>
          </div>
        )}

        {stage === "login" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input icon={<i data-lucide="mail"></i>} placeholder="Garmin Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input icon={<i data-lucide="lock"></i>} placeholder="Password" type="password" />
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" size="sm" style={{ flex: 1 }} onClick={() => setStage("initial")}>Cancel</Button>
              <Button variant="primary" size="sm" style={{ flex: 2 }} onClick={() => setStage("mfa")}>Login</Button>
            </div>
          </div>
        )}

        {stage === "mfa" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, fontStyle: "italic", textAlign: "center", color: "var(--text-muted)", margin: 0 }}>Enter the code sent to your email</p>
            <Input icon={<i data-lucide="key"></i>} placeholder="123456" align="center" />
            <Button variant="secondary" size="sm" fullWidth onClick={() => { setConnected(true); setStage("initial"); setDemo(true); onConnected && onConnected(email); }}>Verify Code</Button>
          </div>
        )}

        <div className="eyebrow" style={{ textAlign: "center", opacity: 0.5, letterSpacing: "0.4em" }}>Stability Index</div>
      </div>
    </div>
  );
}

function App() {
  const { IconButton, Badge, Tabs } = NS;
  const [tab, setTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [demo, setDemo] = useState(true);
  const data = window.HS_DATA;

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const latest = data.metrics[data.metrics.length - 1];
  const dateLabel = new Date(latest.date + "T00:00").toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 140 }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "48px 32px 0" }}>
        {/* HEADER */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 32, borderBottom: "1px solid var(--border-hairline)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src="../../assets/logo.png" alt="Health Signal" style={{ width: 52, height: 52, objectFit: "contain" }} />
              <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontStyle: "italic", fontSize: 38, letterSpacing: "-0.01em" }}>
                Health<span className="text-gradient">Signal</span>
              </h1>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", margin: 0, paddingLeft: 4 }}>Multi-Agent Wellness Intelligence Hub</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
            <Badge look="neu" tone={demo ? "primary" : "neutral"} dot pulse>{demo ? "Demo Mode Active" : "Deep Synthesis Active"}</Badge>
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 19, color: "var(--text-primary)", opacity: 0.9 }}>{dateLabel}</span>
            <div style={{ position: "relative" }}>
              <IconButton ariaLabel="Settings" icon={<i data-lucide={showSettings ? "x" : "settings"}></i>} active={showSettings} variant={showSettings ? "primary" : "muted"} onClick={() => setShowSettings(!showSettings)} />
              {showSettings && <SettingsPopover onClose={() => setShowSettings(false)} demo={demo} setDemo={setDemo} />}
            </div>
          </div>
        </header>

        {/* SCREEN */}
        <div style={{ paddingTop: 56 }}>
          {tab === "overview" && <OverviewScreen data={data} />}
          {tab === "analysis" && <AnalysisScreen data={data} />}
          {tab === "trends" && <TrendsScreen data={data} />}
        </div>
      </div>

      {/* FLOATING NAV */}
      <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "overview", label: "Home", icon: <i data-lucide="layout-dashboard"></i> },
            { value: "analysis", label: "Analysis", icon: <i data-lucide="search"></i> },
            { value: "trends", label: "Signals", icon: <i data-lucide="line-chart"></i> },
          ]}
        />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
