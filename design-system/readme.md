# Health Signal — Design System

A warm, calm **Japandi** (Japanese + Scandinavian) design system for **Health Signal**, a personal health-optimization product that turns raw Garmin wearable data into a single daily wellness signal. The visual language is built on **soft neumorphism** (dual-shadow "pebble" surfaces), a clay-and-sage earth palette, oversized soft radii, and high-craft serif/sans typography. The intent is calm: health data is stressful, so the interface leans on negative space, muted earth tones, and gentle motion to prevent information overload.

> **Sources.** This system was derived from the **Health Signal** codebase (attached locally as `Health Signal/`). Key references:
> - `Health Signal/web/src/app/globals.css` — original Tailwind theme tokens, neumorphic shadows, palette.
> - `Health Signal/web/src/components/DashboardClient.tsx` — the full dashboard (~1000 lines): score ring, metric tiles, expert cards, charts, floating nav, settings/login.
> - `Health Signal/web/src/lib/mockData.ts` & `db.ts` — demo data and the health-metric schema.
> - `Health Signal/docs/index.md`, `README.md` — product vision, "Council of Experts" architecture, Japandi rationale.
> - Logo: `Health Signal/web/public/logo.png` → `assets/logo.png`.

---

## Product context

**Health Signal** is a "Council of Experts" engine: after ingesting Garmin data, parallel AI agents (Sleep, Performance/Cardio, Stress/Metabolic) analyze distinct verticals, then a synthesizer resolves them into a unified narrative and a daily **Wellness Score (0–100)**. The presentation layer — and the only UI surface — is a single-page **Next.js dashboard** with three tabs: **Overview**, **Analysis**, and **Trends**. There is one product (the web dashboard); this system models it and the primitives it is built from.

---

## CONTENT FUNDAMENTALS

How Health Signal writes copy. The voice is **calm, premium, and quietly clinical** — like a thoughtful coach, not an alarm.

- **Tone:** Reassuring and authoritative. Health states are framed as *signals* and *narratives*, never warnings. e.g. *"Your body is currently in an optimal state of recovery and readiness."*
- **Person:** Second person, addressing the user directly — *"your body," "your cardiovascular system," "your 30-day average."* The AI agents speak in third person about themselves ("The Recovery Architect notes…").
- **Casing:** Two registers. (1) **Headings** are Title Case serif, often poetic — *"Synthesis Report," "Recovery Symphony," "Multi-Agent Counsel."* (2) **Micro-labels / eyebrows** are ALL-CAPS with extreme letter-spacing — *"COMPOSITE INDEX," "STABILITY INDEX," "TACTICAL STRATEGY."*
- **Vocabulary:** Elevated, slightly scientific metaphors — *Signal vs Noise, Synthesis, Flux Analysis, Charge vs Drain, Composite Index, Synthetic Logic, eustress vs distress.* Agents have evocative names: **Cardio Guardian, Sleep Navigator, Metabolic Sage, Recovery Architect.*
- **Numbers:** Front and center. Big italic serif numerals (the score, BPM, points). Units are short uppercase tags (BPM, kcal, /100, Pts).
- **Emoji:** Used sparingly **in documentation only** (the product README uses 🌿 🏛️ as section markers). **Never in the product UI.** Do not use emoji in interfaces.
- **Vibe:** Measured, spacious, confident. Short declarative sentences. No exclamation marks in-product, no hype, no growth-hacky CTAs. Buttons are terse uppercase verbs — *CONNECT GARMIN, SYNC HEALTH DATA, VERIFY CODE.*

---

## VISUAL FOUNDATIONS

**Palette.** A warm Japandi earth scheme on a single paper ground.
- Ground: warm paper `#F8F5F2` (everything sits on this one surface — neumorphism means cards are the *same* color as the page, defined only by shadow).
- Primary: **clay / copper `#B89076`** — accents, the wordmark gradient, primary chart line, progress fills.
- Secondary: **deep taupe `#6D5D50`** — supporting text, second chart series, secondary buttons.
- Accent: **sage green `#8A9A5B`** — used sparingly (the single botanical accent).
- Text: warm sumi ink `#2D2926`; muted `#595959`.
- Status: muted earth tones — moss success `#5D6B3C`, terracotta danger `#8E4232`, amber-clay warning `#94683A`, slate info `#5B6B7A`. Never neon.
- Imagery vibe: warm, low-saturation, earthen. No cool blues, no purple gradients.

**Type.** Serif display + sans UI.
- **Lora** (serif) for all headings and the signature **big italic numerals** (the score, metric values). Headings are often italic.
- **Raleway** (sans) for body, UI, and the **ultra-wide uppercase eyebrow labels** (weight 900, tracking up to 0.4em) — a core brand signature.
- **Fira Code** (mono) for raw numeric/data readouts. (See caveats — font binary not bundled.)

**Spacing & layout.** Generous. 4px base grid but the UI lives in the larger steps (32–96px gaps). Max width 1280px, centered, with a fixed floating tab bar at the bottom. Sections open with an eyebrow label + hairline rule.

**Radii — the "pebble" language.** Very soft and oversized: chips 12–16px, buttons 24px, cards 30–60px, pills/nav fully rounded. Large surfaces feel like smooth river stones.

**Backgrounds.** Flat warm paper — **no images, no full-bleed photography, no repeating patterns.** The only "gradients" are (1) the clay→taupe text gradient on the wordmark, (2) faint chart area fills (color → transparent), and (3) subtle blurred clay "halo" bleeds behind expert-card corners. No busy backgrounds; calm emptiness is the point.

**Shadows / elevation — soft neumorphism (the defining motif).** Elevation is NOT a drop shadow on a card. It is a **dual shadow on the same paper color**: a warm near-white highlight (`#FCFAF8`) on the upper-left and a soft clay shadow (`rgba(109,93,80,0.16)`) on the lower-right.
- **Flat / raised** (`--shadow-neu`): the default pebble.
- **Inset / pressed** (`--shadow-neu-inset`): active tabs, input wells, pressed buttons, sunken chips.
- **Small** (`--shadow-neu-sm`): chips, icon buttons.
- **Float** (`--shadow-float`): the bottom nav and popovers, lifted with a real cast shadow.
- **Glow** (`--glow-clay`): a soft clay halo behind active dots and chart strokes.

**Borders.** Almost none. The signature line is a **clay hairline at ~15% opacity** (`--border-hairline`) used for section rules and the header underline. Cards have no border — they are defined by shadow alone.

**Cards.** Same paper as the page + neumorphic flat shadow + large radius (30–60px) + roomy padding (40–56px). Hover lifts them gently (`translateY(-6px)`). No outlines.

**Animation.** Calm and settled. The signature easing is `cubic-bezier(0.16, 1, 0.3, 1)` (a slow, confident ease-out). Entrances fade + rise (`opacity 0→1`, `y 20→0`) over ~0.5–1s. The score ring sweeps its arc over 2s. **No bounces, no spins** (except the sync icon), no infinite decorative loops. Default transition is 0.2s on shadow/transform/color.

**Hover states.** Cards lift (`translateY`); icon chips scale to 1.1; ghost text brightens from muted to primary. No color inversions.

**Press states.** Raised pebbles sink to an **inset** shadow + 1px translate — the soft-UI "press into the surface" feel. No shrink-scale.

**Transparency & blur.** Used lightly: the floating nav has a backdrop blur; expert cards carry a faint blurred clay halo; chart fills and the hairline use low-opacity clay/taupe. Glass is never the dominant look — paper is.

---

## ICONOGRAPHY

- **Library: [Lucide](https://lucide.dev)** — the product uses `lucide-react`. Clean, rounded, **2px stroke**, outline (not filled) icons. This matches the calm, light Japandi line work.
- In this design system's HTML cards and the UI kit, Lucide is loaded from CDN (`lucide@0.460.0` UMD) and rendered via `<i data-lucide="name"></i>` + `lucide.createIcons()`. Stroke inherits `currentColor`, so icons tint to clay/taupe/sage/status colors.
- **Common icons:** `activity, heart, moon, zap, flame, brain, sparkles, layout-dashboard, search, line-chart, settings, refresh-cw, message-square, mail, lock, key, leaf, x`.
- Icons usually sit inside a small **neumorphic chip** (raised `--radius-lg` pebble) colored by role.
- **Emoji:** never in-product (docs only). **Unicode glyphs:** not used as icons.
- **Logo:** `assets/logo.png` — a clay heart with signal/sound waves and an ECG pulse line forming a downward "signal" arrow. Pair with the **Health·Signal** wordmark (Lora black italic; "Signal" carries the clay→taupe text gradient). No hand-drawn SVG icons anywhere — use Lucide.

---

## Index / Manifest

**Root**
- `styles.css` — the single entry point consumers link (imports only).
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills-compatible front matter + usage.
- `assets/logo.png` — the Health Signal mark.

**Tokens** (`tokens/`, all imported by `styles.css`)
- `fonts.css` — Lora + Raleway (Google Fonts).
- `colors.css` — paper/ink neutrals, clay, taupe, sage, status; semantic aliases.
- `typography.css` — families, scale, weights, tracking.
- `spacing.css` — spacing, the pebble radii, layout, motion easings.
- `elevation.css` — the neumorphic shadow system.
- `base.css` — element defaults + `.neu-*`, `.eyebrow`, `.text-gradient` utilities.

**Components** (`window.HealthSignalDesignSystem_f0a9a2`)
- `components/core/` — `Button`, `IconButton`, `Badge`, `Input`, `Card`, `Tabs`.
- `components/data/` — `MetricTile`, `ScoreRing`, `ExpertCard`.
- `components/layout/` — `SectionHeader`.

**UI kit**
- `ui_kits/dashboard/` — interactive recreation of the full Health Signal dashboard (Overview / Analysis / Trends + settings & Garmin login). See its `README.md`.

**Specimen cards** — `guidelines/*.card.html` (Colors, Type, Spacing, Brand) render in the Design System tab.
