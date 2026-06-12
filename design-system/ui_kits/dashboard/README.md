# Health Signal — Dashboard UI Kit

An interactive, high-fidelity recreation of the Health Signal wellness dashboard, the product's single core surface. Built entirely from this design system's bundled components.

## Run
Open `index.html`. It loads the design-system bundle (`_ds_bundle.js`), Lucide icons, and the screen modules.

## Files
- `index.html` — shell that loads everything in order.
- `data.js` — the demo dataset (mirrors the product's `mockData.ts`). Sets `window.HS_DATA`.
- `charts.jsx` — lightweight SVG `AreaChartMini` / `BarChartMini` (Japandi-styled; the product uses Recharts).
- `screens.jsx` — `OverviewScreen`, `AnalysisScreen`, `TrendsScreen`.
- `app.jsx` — header, settings popover with the Garmin login flow, and the floating tab nav.

## Surfaces
- **Overview** — composite score ring, four metric tiles, and the "Recovery Symphony" charge-vs-drain area chart.
- **Analysis** — the synthesis report + tactical strategy panel, plus the three-up "Multi-Agent Counsel" expert cards.
- **Trends** — biometric flow (area) and stress indices (bar).

## Interactions
- Switch surfaces from the floating bottom **Tabs**.
- Open **Settings** (gear) to step through the Garmin login flow: initial → email/password → MFA → connected, plus the demo/live data toggle.

## Components used
`ScoreRing`, `MetricTile`, `ExpertCard`, `SectionHeader`, `Card`, `Button`, `IconButton`, `Input`, `Badge`, `Tabs` — all from `window.HealthSignalDesignSystem_f0a9a2`.

## Fidelity notes
Charts are simplified SVG stand-ins for the product's Recharts visualisations. The Garmin login is a visual mock (no network). Everything else mirrors the real layout, type, and neumorphic styling.
