# VedaAI — AI-Powered Question Paper Generator

VedaAI is a full-stack web app that lets teachers generate complete, exam-ready question papers in seconds using AI. Upload study material (image or text), configure question types and marks, and the AI builds a structured paper with sections, difficulty distribution, and an answer key.

---

## Architecture

```
┌─────────────────┐        HTTP/REST        ┌──────────────────────┐
│  Next.js 14     │ ──────────────────────► │  Express + TypeScript │
│  (apps/web)     │                         │  (apps/server)        │
│  :3000          │ ◄────────────────────── │  :4000                │
└─────────────────┘        WebSocket        └──────────┬───────────┘
                                                       │
                              ┌────────────────────────┼───────────────────┐
                              │                        │                   │
                       ┌──────▼──────┐        ┌───────▼──────┐   ┌───────▼──────┐
                       │  MongoDB 7  │        │   Redis 7    │   │   BullMQ     │
                       │  (data)     │        │   (cache +   │   │   (job queue)│
                       └─────────────┘        │    queue)    │   └──────────────┘
                                              └──────────────┘
```

**LLM Providers** (configurable via `LLM_PROVIDER` env var):
- **Groq** — `llama-4-scout-17b` for image vision + `llama-3.3-70b-versatile` for JSON generation (default)
- **Anthropic** — `claude-sonnet-4-6`
- **OpenAI** — `gpt-4o`

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | Next.js (App Router) | 14.2 |
| Styling | Tailwind CSS | 3.4 |
| Animations | Framer Motion | 12 |
| State management | Zustand (+ persist) | 5 |
| HTTP client | Axios | 1.7 |
| Backend framework | Express | 4.21 |
| Language | TypeScript | 5.7 |
| Database | MongoDB + Mongoose | 7 / 8.9 |
| Cache + queue broker | Redis + ioredis | 7 / 5.4 |
| Job queue | BullMQ | 5 |
| Real-time | WebSocket (ws) | 8 |
| PDF generation | Puppeteer | 24 |
| File uploads | Multer | 2 |
| Schema validation | Zod | 3.24 |
| Monorepo | Turborepo + npm workspaces | 2.3 |
| LLM SDKs | @anthropic-ai/sdk, openai | latest |

---

## Project Structure

```
veda-ai/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── app/              # App Router pages
│   │   │   ├── page.tsx           # Home (latest paper)
│   │   │   ├── assignments/       # Assignments list
│   │   │   ├── assignments/[id]/  # Paper output view
│   │   │   ├── create/            # Create assignment form
│   │   │   └── settings/          # User profile settings
│   │   ├── components/
│   │   │   ├── layout/       # Sidebar, TopBar, MobileNav
│   │   │   ├── assignments/  # AssignmentCard, AssignmentGrid, FilterBar
│   │   │   ├── create/       # FileUpload, QuestionTypeList, DueDatePicker
│   │   │   ├── output/       # QuestionPaper, PaperSection, AnswerKey
│   │   │   └── ui/           # Button, Badge, Spinner, Modal
│   │   ├── hooks/            # useWebSocket, useAssignments, useJobStatus
│   │   ├── store/            # Zustand stores
│   │   └── lib/              # Axios instance, utils
│   │
│   └── server/               # Express backend
│       └── src/
│           ├── config/       # env validation, MongoDB, Redis
│           ├── controllers/  # assignmentController, jobController
│           ├── middleware/   # upload (Multer), errorHandler, validate
│           ├── models/       # Assignment, QuestionPaper (Mongoose)
│           ├── queues/       # BullMQ question-generation queue
│           ├── routes/       # assignments, jobs
│           ├── services/     # llmService (prompt builder + providers), pdfService
│           ├── websocket/    # wsServer (subscription map + emit helper)
│           └── workers/      # questionWorker (BullMQ processor)
│
├── packages/
│   └── shared/               # Zod schemas + TypeScript types shared by both apps
│
├── docker-compose.yml        # MongoDB + Redis
├── turbo.json
└── package.json
```

---

## Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Docker Desktop** (for MongoDB and Redis)
- An API key for at least one LLM provider:
  - [Groq](https://console.groq.com) — free tier available, recommended
  - [Anthropic](https://console.anthropic.com)
  - [OpenAI](https://platform.openai.com)

---

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd veda-ai
npm install
```

### 2. Start infrastructure (MongoDB + Redis)

```bash
docker compose up -d
```

Verify both containers are healthy:

```bash
docker compose ps
```

### 3. Configure the backend

Create `apps/server/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
UPLOADS_DIR=./uploads

# Choose one provider and set its key
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here

# ANTHROPIC_API_KEY=your_anthropic_key_here
# OPENAI_API_KEY=your_openai_key_here
```

### 4. Configure the frontend

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

### 5. Run the project

**Option A — run everything with Turborepo:**

```bash
npm run dev
```

**Option B — run apps separately (recommended for development):**

```bash
# Terminal 1 — backend
cd apps/server
npx tsx src/index.ts

# Terminal 2 — frontend
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### `apps/server/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `4000` | Express server port |
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `REDIS_URL` | Yes | — | Redis connection string |
| `LLM_PROVIDER` | No | `anthropic` | `anthropic` \| `openai` \| `groq` |
| `ANTHROPIC_API_KEY` | If provider=anthropic | — | Anthropic API key |
| `OPENAI_API_KEY` | If provider=openai | — | OpenAI API key |
| `GROQ_API_KEY` | If provider=groq | — | Groq API key |
| `UPLOADS_DIR` | No | `./uploads` | Directory for uploaded files and PDFs |
| `NODE_ENV` | No | `development` | `development` \| `production` |

### `apps/web/.env.local`

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend base URL |
| `NEXT_PUBLIC_WS_URL` | Yes | WebSocket URL |

---

## API Reference

Base URL: `http://localhost:4000`

### Assignments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments` | List all assignments (Redis-cached 5 min) |
| `POST` | `/api/assignments` | Create assignment + enqueue generation job |
| `GET` | `/api/assignments/:id` | Get single assignment |
| `DELETE` | `/api/assignments/:id` | Delete assignment + its question paper |
| `GET` | `/api/assignments/:id/paper` | Get generated question paper |
| `POST` | `/api/assignments/:id/pdf` | Generate PDF from paper |
| `GET` | `/api/assignments/:id/pdf` | Download generated PDF |

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs/:jobId` | Get BullMQ job status |

### POST `/api/assignments` — FormData fields

| Field | Type | Description |
|---|---|---|
| `file` | File (optional) | JPEG, PNG, or TXT — study material |
| `pastedText` | string (optional) | Direct text input (alternative to file) |
| `title` | string (optional) | Paper title (auto-derived from filename if omitted) |
| `schoolName` | string (optional) | Overrides the school name on the generated paper |
| `dueDate` | string (ISO) | Assignment due date |
| `questionTypes` | JSON string | Array of `{ type, count, marksPerQuestion }` |
| `additionalInfo` | string (optional) | Extra instructions for the AI |

---

## WebSocket Events

Connect to `ws://localhost:4000/ws`. After connecting, send a subscribe message:

```json
{ "type": "subscribe", "assignmentId": "<id>" }
```

### Incoming events

| Event | Payload | Description |
|---|---|---|
| `job:queued` | `{ assignmentId, jobId, position }` | Job added to queue |
| `job:started` | `{ assignmentId, jobId }` | Worker picked up job |
| `job:progress` | `{ assignmentId, jobId, percent, message }` | Progress update |
| `job:completed` | `{ assignmentId, jobId, paperId }` | Paper ready |
| `job:failed` | `{ assignmentId, jobId, error }` | Generation failed |

The frontend falls back to HTTP polling every 3 seconds if the WebSocket connection drops.

---

## Features

- **AI paper generation** — structured question papers with sections, difficulty distribution (40% Easy / 40% Moderate / 20% Challenging), and a collapsible answer key
- **Multiple source types** — upload an image (JPEG/PNG), a text file (.txt), or paste text directly
- **MCQ support** — generates exactly 4 options per MCQ question; answer key entries are aligned to exact option text
- **Configurable question types** — MCQ, Short Answer, Diagram/Graph-Based, Numerical Problems; set count and marks per question
- **PDF export** — Puppeteer renders an A4-formatted exam paper PDF for download
- **Real-time progress** — WebSocket events drive a live progress bar during generation; polling fallback for unreliable connections
- **User settings** — teacher name, school name, and city are persisted in localStorage and reflected on the sidebar, top bar, and generated papers
- **Redis cache** — assignment list is cached for 5 minutes; invalidated on create/delete

---

## Known Limitations

- No authentication — single-user, local use only
- Groq's vision model (`llama-4-scout`) occasionally misses content in dense images; the two-step extraction approach mitigates this
- PDF generation requires Puppeteer's Chromium download (~300 MB) on first run
- File uploads are stored on local disk; not suitable for multi-instance deployment without shared storage
