# PM Agent

An agent SaaS for product managers, built on the Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`). It features a minimal core (Read / Write / Search / Act), skill-based extension, transparent JSONL session logging, and human approval on every external write.

## Key Features

- **Agent Core**: Uses `@anthropic-ai/claude-agent-sdk` for a robust `query()` loop.
- **Skill-based Extension**: Markdown-based skills (`/skills`) loaded dynamically.
- **Transparent Logging**: Sessions stored as JSONL for full auditability.
- **Human-in-the-Loop**: External writes require explicit human approval via the UI.
- **Japandi UI**: Soft-neumorphic design system Vendored under `/design-system` for the frontend.

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node 20+ (ESM, `tsx` for dev)
- **Agent**: `@anthropic-ai/claude-agent-sdk`
- **Model**: Claude Sonnet 4.6 (default)
- **API**: Hono (SSE streaming)
- **Frontend**: Next.js 15 / React 19 (App Router)
- **Styling**: Japandi design system / CSS Tokens

## Prerequisites

- Node.js 20 or higher
- npm or pnpm
- Anthropic API Key (`ANTHROPIC_API_KEY`)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Meridian
```

### 2. Install Dependencies

Install root dependencies (API):

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix web install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `ANTHROPIC_API_KEY` | Required for Claude Agent SDK | `sk-ant-api03-...` |
| `PM_AGENT_MODEL` | Default model used | `claude-sonnet-4-6` |
| `PM_AGENT_MAX_TURNS` | Max agent loop turns | `30` |
| `PORT` | API server port | `8787` |

### 4. Start Development Servers

You will need to run both the API server and the Next.js frontend.

```bash
# Terminal 1: API Server
npm run dev

# Terminal 2: Web App
npm --prefix web run dev
```

The API will be available at `http://localhost:8787` and the web app at `http://localhost:3000`.

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Directory Structure

```
├── src/                  # API and Agent core
│   ├── agent/            # Agent loop and tool primitives
│   ├── api/              # Hono server implementation
│   └── extensions/       # External connector stubs (Jira/Slack)
├── web/                  # Next.js 15 App Router frontend
│   ├── app/              # Next.js pages and globals
│   ├── components/       # UI Components
│   └── lib/              # API clients
├── sessions/             # JSONL session log storage
├── skills/               # Markdown-based agent skills
├── workspaces/           # Workspace-specific context
├── design-system/        # Japandi design reference bundle
└── evals/                # Evaluation scripts
```

### Request Lifecycle

1. User submits prompt via Next.js Web App.
2. Request hits Hono API `/sessions`.
3. Agent SDK `query()` loop starts in `src/agent/run-agent.ts`.
4. Agent uses tools (Read, Write, Search, Act). External actions emit `approval_requested` over SSE.
5. User approves action in the UI, POSTing to `/approvals/:id`.
6. Agent continues and final response streams back via SSE.
7. Session state and tool usage persisted to JSONL in `/sessions`.

### Key Components

**Agent Loop (`src/agent/run-agent.ts`)**
Single agent utilizing `@anthropic-ai/claude-agent-sdk`. System prompt dynamically includes workspace context and matched skill fragments.

**Tools & Approval Gate**
Tools are divided into primitives (Read, Write, Search, Act). The `Write` and `Act` tools are strictly gated by human approval in `canUseTool`, blocking execution until approved via API.

**Session Storage (`/sessions/*.jsonl`)**
Log lines contain `user`, `assistant`, `tool_call`, `tool_result`, or `meta`. Ensures perfect transparency without polluting model context.

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start API server with watch (`tsx`) |
| `npm run start` | Start API server |
| `npm run typecheck` | Run TypeScript compiler without emitting files |
| `npm run evals` | Run evaluation harness |
| `npm --prefix web run dev` | Start Next.js frontend dev server |
| `npm --prefix web run typecheck` | Typecheck frontend |

## Testing

Evaluations are used to ensure agent capability and safety.

```bash
# Run evaluations
npm run evals
```

## Deployment

Since there are no specialized deployment configs present (e.g. `Dockerfile`, `vercel.json`), here is general guidance.

### API Deployment (Node.js)

1. Set up a Node.js environment (e.g. Render, Railway, AWS ECS).
2. Install dependencies: `npm install --omit=dev`.
3. Start the server: `npm run start`.
4. Ensure `ANTHROPIC_API_KEY` and other environment variables are set securely.
5. You will need persistent volume storage mounted at `/sessions` and `/workspaces` if persisting file logs.

### Web Deployment (Vercel/Next.js)

The `/web` directory can be deployed directly to Vercel or Netlify.

1. Connect your repository to Vercel.
2. Set the Root Directory to `web/`.
3. Provide any required environment variables (e.g., `NEXT_PUBLIC_API_BASE`).

## Troubleshooting

### API Port Conflicts

**Error:** `EADDRINUSE: address already in use :::8787`

**Solution:** Change the port in your `.env` file or stop the conflicting process.

### Frontend Port Conflicts

**Error:** Port 3000 is in use.

**Solution:** Next.js will ask to use another port, or you can force it:
```bash
npm --prefix web run dev -- -p 3001
```

### Missing API Key

**Error:** Agent fails to start or respond.

**Solution:** Ensure `ANTHROPIC_API_KEY` is properly set in your root `.env` file.
