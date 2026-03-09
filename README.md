# InterviewX

InterviewX is an AI-assisted interview preparation platform that combines mock interviews, a career coaching chat assistant, resume management, quiz-based assessment, and learning roadmap generation in one workflow.

## Problem Statement
Preparing for interviews usually requires multiple disconnected tools: question practice, resume editing, feedback, and career guidance. This project addresses that fragmentation by giving users a single platform where they can practice, improve, and track progress.

## Project Overview
InterviewX helps users:
- Practice mock interviews (voice workflow + AI-generated feedback)
- Use an AI career coach chat with persistent history
- Create, edit, and organize multiple resumes
- Take technical quiz assessments and review strengths/gaps
- Generate AI learning roadmaps with visual node graphs
- View industry insights such as trends, demand, and salary ranges

## Core Features
- AI mock interview generation and interview sessions
- AI interview feedback from transcript analysis
- Career coaching chat with streaming responses and chat history
- Multi-resume creation, editing, deletion, and viewing
- Resume content enhancement for summary and experience sections
- Quiz generation, scoring, and improvement tips
- Roadmap generation (nodes + edges for React Flow)
- Industry insights dashboard with weekly background refresh
- Authentication (credentials + Google + GitHub)
- Stripe subscription flows for premium gating

## Key Modules
- Mock Interview System
  - Voice workflow with VAPI client events and interview lifecycle handling
  - Interview question generation and feedback storage
- Career Coach / AI Assistant
  - Streaming chat endpoint and persisted chat history
- Resume Builder
  - Multi-resume management with section-by-section editing
  - Live preview via shared context state
  - AI-assisted rewrite for summary/experience content
- Assessment Module
  - AI-generated technical quiz questions based on user profile
  - Score tracking, explanations, and personalized improvement tips
- Career Roadmap Generator
  - AI-generated learning roadmaps stored as nodes and edges
  - Interactive roadmap visualization with history support
- AI Pipelines
  - Interview question generation
  - Transcript-to-feedback scoring
  - Quiz generation and tip generation
  - Roadmap JSON graph generation
  - Industry insights generation (scheduled)


## Tech Stack
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI, Recharts, React Flow
- Backend: Next.js App Router, Server Actions, API Routes
- AI: Groq (Llama 3.1), Google Gemini, VAPI
- Background Jobs: Inngest
- Databases:
  - PostgreSQL via Prisma (users profile mirror, resumes, chats, assessments, roadmaps, insights)
  - MongoDB via Mongoose/adapter (auth users, interviews, interview feedback, subscription fields)
- Auth: NextAuth (Credentials, Google, GitHub)
- Payments: Stripe checkout + webhook

## Architecture Overview
- App Router pages are grouped by route segments (`(auth)`, `(marketing)`, `(root)`, `tools`)
- Client components handle interactive flows (chat UI, interview call UI, resume forms)
- Server Actions handle authenticated mutations (resume CRUD, chat start, roadmap generation, quiz save)
- API routes handle streaming, webhooks, and external callbacks
- Hybrid persistence model is used:
  - MongoDB for interview session artifacts and auth adapter records
  - PostgreSQL for core product entities and analytics

## Setup Instructions
1. Clone and install
```bash
git clone <repo-url>
cd interview_x
npm install
```

2. Configure environment (`.env.local`)
```env
MONGODB_URI=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GROQ_API_KEY=
GEMINI_API_KEY=

NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_URL=http://localhost:3000

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

NEXT_PUBLIC_ADMIN_EMAIL=
```

3. Run Prisma migrations
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start app
```bash
npm run dev
```

5. Optional: start Inngest dev server
```bash
npx inngest-cli@latest dev
```

