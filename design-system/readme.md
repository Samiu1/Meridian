# Meridian — Design System

A warm, calm **Japandi** (Japanese + Scandinavian) design system for **Meridian**, an agent SaaS for product managers. Adapted from the original **Health Signal** design system, the visual language is built on **soft neumorphism** (dual-shadow "pebble" surfaces), a clay-and-sage earth palette, oversized soft radii, and high-craft serif/sans typography. The intent is calm and high-craft: product management data and agent tracking can be stressful, so the interface leans on negative space, muted earth tones, and gentle motion to focus focus on the content.

> [!NOTE]
> **Integration History.** This design system was originally vendored from the **Health Signal** codebase and has since been refactored in **Meridian** to use **Tailwind CSS v4** and **shadcn/ui** components.
>
> Key references:
> - [web/app/globals.css](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/app/globals.css) — Consolidated Tailwind CSS v4 `@theme inline` tokens, neumorphic shadows, and custom utilities (like `.eyebrow` and `.text-gradient`).
> - [web/components/ui/](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/components/ui/) — Migrated shadcn/ui primitives (`Button`, `Card`, `Badge`, `Textarea`, etc.) styled to match the Japandi neumorphic aesthetic.
> - [web/app/page.tsx](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/app/page.tsx) & [web/app/sessions/[id]/page.tsx](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/app/sessions/%5Bid%5D/page.tsx) — Next.js 15 pages implementing the agent dashboard.

---

## PRODUCT CONTEXT

**Meridian** is a "Human-in-the-Loop" Agent SaaS for Product Managers. It runs complex, long-running agent workflows (such as PRD drafting, spec creation, and ticket generation) powered by `@anthropic-ai/claude-agent-sdk`.
The presentation layer is a clean **Next.js dashboard** that streams live agent sessions, manages a list of recent sessions, and displays an **Approval Gate** (via the `ApprovalCard` component) where users must approve external writes or acts before the agent executes them.

---

## CONTENT FUNDAMENTALS

How Meridian writes copy. The voice is **calm, premium, and quietly clinical** — like a thoughtful co-pilot, not an alarm.

- **Tone:** Reassuring, collaborative, and authoritative. Agent outcomes are framed as *drafts* and *proposals*, waiting for human guidance.
- **Person:** Second person for user instructions (*"your workspace," "your session"*), and third person for agent actions (*"The agent is drafting a PRD..."*).
- **Casing:** Two registers. (1) **Headings** are Title Case serif, often thoughtful — *"What are we shaping today?," "Live Session," "Recent Sessions."* (2) **Micro-labels / eyebrows** are ALL-CAPS with extreme letter-spacing — *"NEW SESSION," "LIVE FEED," "RECENT SESSIONS."*
- **Vocabulary:** Professional, precise, slightly elevated product terminology — *Composing, Synthesis, Refactoring, Intent, Session, State, Human-in-the-Loop.*
- **Numbers:** Data is presented cleanly. Cost indicators use monospace typography (e.g. `$0.045`) and badge-style highlights.
- **Emoji:** Used sparingly **in documentation only**. **Never in the product UI.** Do not use emoji in interfaces.
- **Vibe:** Measured, spacious, confident. Short declarative sentences. No exclamation marks in-product. Buttons are terse, uppercase/title actions — *Begin session, Approve, Reject.*

---

## VISUAL FOUNDATIONS

**Palette.** A warm Japandi earth scheme on a single paper ground.
- Ground: warm paper `#F8F5F2` (everything sits on this one surface — neumorphism means cards are the *same* color as the page, defined only by shadow).
- Primary: **clay / copper `#B89076`** — accents, the wordmark gradient, primary progress fills.
- Secondary: **deep taupe `#6D5D50`** — supporting text, secondary buttons.
- Accent: **sage green `#8A9A5B`** — used sparingly (the single botanical accent).
- Text: warm sumi ink `#2D2926`; muted `#595959`.
- Status: muted earth tones — moss success `#5D6B3C`, terracotta danger `#8E4232`, amber-clay warning `#94683A`, slate info `#5B6B7A`. Never neon.
- Imagery vibe: warm, low-saturation, earthen. No cool blues, no purple gradients.

**Type.** Serif display + sans UI.
- **Lora** (serif) for all headings and the signature **big italic numerals** (the score, metric values). Headings are often italic.
- **Plus Jakarta Sans** (sans) for body, UI, and the **ultra-wide uppercase eyebrow labels** (weight 900, tracking up to 0.4em) — a core brand signature.
- **Fira Code** (mono) for raw numeric/data readouts (e.g., costs, logs, session tokens).

**Spacing & layout.** Generous. 4px base grid but the UI lives in the larger steps (32–96px gaps). Max width 1152px (`max-w-6xl`), centered. Sections open with an eyebrow label + hairline rule.

**Radii — the "pebble" language.** Very soft and oversized: chips 12–16px, buttons 24px, cards 30–60px, pills/nav fully rounded. Large surfaces feel like smooth river stones.

**Backgrounds.** Flat warm paper — **no images, no full-bleed photography, no repeating patterns.** The only "gradients" are (1) the clay→taupe text gradient on the wordmark, and (2) subtle blurred clay "halo" bleeds. No busy backgrounds; calm emptiness is the point.

**Shadows / elevation — soft neumorphism (the defining motif).** Elevation is NOT a drop shadow on a card. It is a **dual shadow on the same paper color**: a warm near-white highlight (`#FCFAF8`) on the upper-left and a soft clay shadow (`rgba(109,93,80,0.16)`) on the lower-right.
- **Flat / raised** (`--shadow-neu`): the default pebble.
- **Inset / pressed** (`--shadow-neu-inset`): active tabs, input wells, pressed buttons, sunken chips.
- **Small** (`--shadow-neu-sm`): chips, icon buttons.
- **Float** (`--shadow-float`): lifted components with a real cast shadow.
- **Glow** (`--glow-clay`): a soft clay halo behind active dots and chart strokes.

**Borders.** Almost none. The signature line is a **clay hairline at ~15% opacity** (`--border-hairline` / standard tailwind border) used for section rules and the header underline. Cards have no border — they are defined by shadow alone.

**Cards.** Same paper as the page + neumorphic flat shadow + large radius (`rounded-[min(var(--radius-4xl),24px)]`) + roomy padding (`px-(--card-spacing)`). Hover lifts them gently. No outlines.

**Animation.** Calm and settled. The signature easing is `cubic-bezier(0.16, 1, 0.3, 1)` (a slow, confident ease-out). Entrances fade + rise (`opacity 0→1`, `y 20→0`) over ~0.5s (mapped to `.animate-rise`). **No bounces, no spins** (except the sync icon), no infinite decorative loops. Default transition is 0.2s on shadow/transform/color.

**Hover states.** Cards lift (`translateY`); icon chips scale to 1.1; ghost text brightens from muted to primary. No color inversions.

**Press states.** Raised pebbles sink to an **inset** shadow + 1px translate — the soft-UI "press into the surface" feel. No shrink-scale.

**Transparency & blur.** Used lightly: the floating nav has a backdrop blur; chart fills and the hairline use low-opacity clay/taupe. Glass is never the dominant look — paper is.

---

## ICONOGRAPHY

- **Library: [Lucide](https://lucide.dev)** — the product uses `lucide-react`. Clean, rounded, **2px stroke**, outline (not filled) icons. This matches the calm, light Japandi line work.
- **Common icons:** `activity, heart, moon, zap, flame, brain, sparkles, layout-dashboard, search, line-chart, settings, refresh-cw, message-square, mail, lock, key, leaf, x`.
- **Emoji:** never in-product (docs only). **Unicode glyphs:** not used as icons.

---

## INDEX / MANIFEST

In the Meridian workspace, the active styling tokens and UI components are integrated directly into the web application:

**Active Style Files**
- [web/app/globals.css](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/app/globals.css) — Consolidated Tailwind CSS v4 design system, custom utility classes, animations, and typography configurations.
- [web/app/layout.tsx](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/app/layout.tsx) — Main layout loading `Plus Jakarta Sans` and `Lora` fonts.

**UI Components (shadcn/ui)**
Located under [web/components/ui/](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/components/ui/):
- [Button.tsx](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/components/ui/Button.tsx) — Neumorphic button with size and variant states.
- [Card.tsx](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/components/ui/Card.tsx) — Pebble card with customizable elevations and padding.
- [Badge.tsx](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/components/ui/Badge.tsx) — Status indicators with dot/pulse and Japandi colors.
- [textarea.tsx](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/web/components/ui/textarea.tsx) — Input composer field.

**Original Reference Bundle (Read-Only)**
Located under [design-system/](file:///Users/samiulislam/Documents/Samiul Personal/Meridian/design-system/):
- `readme.md` — This guide.
- `SOURCE-README.md` — Original Claude Design handoff instructions.
- `components/` — Prototype JSX implementations of `Button`, `IconButton`, `Badge`, `Input`, `Card`, `Tabs`.
- `guidelines/` — Interactive specimen card HTML files for rendering guidelines (Colors, Type, Elevation, Spacing, Radius, etc.).
- `ui_kits/dashboard/` — Original dashboard prototype code for reference.
