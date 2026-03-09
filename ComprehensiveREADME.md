# InterviewX: Comprehensive Technical Documentation

## 1. System Purpose
InterviewX is a full-stack career preparation application that unifies:
- AI-assisted interview practice
- AI chat-based career coaching
- Resume creation and management
- Quiz-based skill assessment
- AI-generated learning roadmaps
- Industry insights visualization

The project is built as a Next.js App Router monolith with mixed persistence (MongoDB + PostgreSQL) and multiple AI integrations.

## 2. Project Architecture

### 2.1 High-Level Architecture
- Frontend: Next.js pages and client components
- Backend execution: Server Actions + API routes
- Databases:
  - PostgreSQL via Prisma for product entities
  - MongoDB via Mongoose and Mongo adapter for auth/interview artifacts
- AI providers:
  - Groq (Llama 3.1) for generation-heavy workflows
  - Gemini for on-demand industry insights generation
  - VAPI for voice interview runtime
- Background workflows: Inngest cron job for periodic insights refresh

### 2.2 Route Groups
- `src/app/(auth)`: sign in/up pages
- `src/app/(marketing)`: public/presentation and tool-facing flows like chat and roadmap history
- `src/app/(root)`: main interview section and post-login dashboard root
- `src/app/tools`: onboarding and tool dashboards (resume, roadmap, chat, analytics, quiz)
- `src/app/api`: integrations and backend APIs

### 2.3 Layout Composition
- Global layout in `src/app/layout.tsx` with global CSS and toast provider
- Tool layout in `src/app/tools/layout.tsx` adds `ToolsHeader`/footer framing
- Segment layouts in `src/app/(auth)/layout.tsx`, `src/app/(marketing)/layout.tsx`, and `src/app/(root)/layout.tsx`

## 3. Folder Structure Explanation

### 3.1 Core Directories
- `src/actions`: server actions (resume CRUD, roadmap generation, chat session creation, onboarding, quiz persistence)
- `src/app`: routes, pages, and API handlers
- `src/components`: reusable and feature-specific UI components
- `src/lib`: DB clients, service clients, and helpers
- `src/models`: Mongoose models and related helpers
- `src/hooks`: custom React hooks (`use-fetch`)
- `src/context`: local state context (`ResumeInfoContest`)
- `prisma`: relational schema and migrations

### 3.2 Database Layer Split
- Prisma schema in `prisma/schema.prisma`
- Mongoose schemas in:
  - `src/models/User.ts`
  - `src/models/Interviews.ts`
  - `src/models/Feedback.ts`

## 4. Data Model and Database Usage

### 4.1 PostgreSQL (Prisma)
Primary entities:
- `User` (profile mirror keyed by `authUserId`)
- `Assessment` (quiz attempts + AI tip)
- `Resume`, `Experience`, `Education`, `Skill`
- `Chat`, `Message`
- `IndustryInsight`
- `Roadmap`

Defined in `prisma/schema.prisma` and accessed through `src/lib/prisma.ts`.

### 4.2 MongoDB (Mongoose + Adapter)
Used for:
- NextAuth adapter user records and subscription fields
- Interview records (`Interviews` collection)
- Interview feedback records (`FeedBack` collection)

Connection utilities:
- `src/lib/dbConnect.ts`
- `src/lib/mongodb.ts`

## 5. Authentication and Authorization

### 5.1 Auth Providers
Configured in `src/app/api/auth/[...nextauth]/options.ts`:
- Credentials provider (email/password with bcrypt compare)
- Google provider
- GitHub provider
- MongoDB adapter (`@auth/mongodb-adapter`)

### 5.2 Session/JWT Behavior
- Session includes custom `_id`, `email`, and `name`
- JWT callback backfills `_id` for OAuth logins by querying MongoDB user collection

### 5.3 Route Guarding
`src/middleware.ts` protects a small set of routes by token presence. Most feature-level access checks are additionally enforced in server actions and API handlers with `getServerSession` checks.

## 6. Feature Deep Dive

## 6.1 Mock Interview System (Detailed)

### Purpose
Simulate interviews and provide AI-generated feedback from transcript quality.

### Why It Exists
Users need realistic practice and objective post-interview scoring across communication and technical dimensions.

### Core Files
- Interview runtime UI: `src/components/Agent.tsx`
- Interview generation API (VAPI callback target): `src/app/api/vapi/generate/route.ts`
- Interview/feedback persistence and Groq feedback analysis: `src/lib/action.ts`
- Interview pages:
  - `src/app/(root)/interview/page.tsx`
  - `src/app/(root)/interview/[id]/page.tsx`
  - `src/app/(root)/interview/[id]/feedback/page.tsx`
- VAPI assistant settings: `src/constants/index.ts` (`interviewer`)

### Internal Flow
1. User starts interview generation on `src/app/(root)/interview/page.tsx`.
2. `Agent.tsx` starts a VAPI workflow (`type="generate"`) using `NEXT_PUBLIC_VAPI_WORKFLOW_ID`.
3. VAPI calls `src/app/api/vapi/generate/route.ts` with role/type/level/stack/amount.
4. Route prompts Groq to return question array and saves an `Interviews` document.
5. User opens `src/app/(root)/interview/[id]/page.tsx`; `Agent.tsx` runs interview mode with predefined questions.
6. Transcript messages captured from VAPI events are sent to `createFeedBack` in `src/lib/action.ts`.
7. Groq evaluates categories and normalized output is validated using `feedbackSchema` from `src/constants/index.ts`.
8. Feedback is stored in MongoDB and shown on feedback page.

### Design Decisions
- Transcript and interview artifacts are stored in MongoDB alongside interview collections.
- Feedback generation normalizes partial AI responses before persistence.
- Category schema is fixed to 5 categories for consistency.

## 6.2 Speech Processing Pipeline

Implemented through VAPI configuration and SDK events.

### Files
- VAPI client: `src/lib/vapi.ts`
- Assistant/transcriber config: `src/constants/index.ts`
- Runtime event handling: `src/components/Agent.tsx`

### Pipeline Steps
1. User initiates call from `Agent.tsx`.
2. VAPI captures voice.
3. Transcription configured as Deepgram `nova-2` in assistant config.
4. Assistant voice output configured via ElevenLabs settings in assistant config.
5. Final transcript messages are collected from VAPI `message` events and persisted/processed after call completion.

## 6.3 AI Response Generation Flow

### Interview Questions
- Endpoint: `src/app/api/vapi/generate/route.ts`
- Model: Groq Llama 3.1
- Output parsing: defensive cleanup and JSON parsing

### Interview Feedback
- Logic: `src/lib/action.ts#createFeedBack`
- Prompt requests strict JSON categories
- Output validated with Zod (`feedbackSchema`)

### Career Chat Responses
- Endpoint: `src/app/api/chat/route.ts`
- Streams tokenized assistant output
- System prompt constrains assistant to interview/career domain

### Quiz Generation + Improvement Tip
- Logic: `src/actions/interview.ts`
- Generates MCQs and explanation JSON
- Generates personalized improvement tip from incorrect answers

### Resume AI Enhancements
- Summary rewrite: `src/actions/resume.ts#improveWithAI`
- Experience rewrite: `src/actions/resume.ts#improveExperienceWithAI` (HTML-oriented output)

### Roadmap Generation
- Action: `src/actions/generate-roadmap.ts#generateRoadmap`
- Prompts for DAG-style roadmap JSON with nodes/edges and documentation links
- Normalizes title/description/duration before save

## 6.4 Career Coaching Agent (Chat System)

### Purpose
Provide interactive interview/career guidance and store conversation history.

### Files
- Dashboard/start flow: `src/app/tools/ai-chat-dashboard/page.tsx`
- Chat UI: `src/app/(marketing)/ai-chat/[chatId]/page.tsx`
- Streaming backend: `src/app/api/chat/route.ts`
- Chat ending + persistence: `src/app/api/ai-career-chat-agent/chat-end/route.ts`
- Chat DB actions: `src/actions/ai-chat.ts`
- History pages:
  - `src/app/(marketing)/ai-chat/history/page.tsx`
  - `src/app/(marketing)/ai-chat/history/[chatId]/page.tsx`

### User Interaction Flow
1. User clicks Start Chat.
2. `startChat()` creates a Prisma `Chat` record and redirects to `/ai-chat/[chatId]`.
3. Chat page streams replies from `/api/chat` and appends messages incrementally.
4. On End Chat, frontend posts all messages to `/api/ai-career-chat-agent/chat-end`.
5. API writes `Message` rows, marks chat ended, auto-generates title from first user message.
6. History pages read ended chats/messages from PostgreSQL.

### Design Decisions
- Conversation is not persisted per token; persistence happens on explicit "End Chat" action.
- Title generation is lightweight and deterministic from first user message.
- Chat assistant prompt hard-restricts domain scope.

## 6.5 Resume Builder System

### Purpose
Allow users to manage multiple resumes with modular editing and live preview.

### Why It Exists
Users often tailor resumes per role. System supports reusable structured data and quick edits.

### Files
- Resume dashboard/list: `src/app/tools/ai-resume/page.tsx`
- Resume editor page: `src/app/tools/ai-resume/[resumeId]/edit/page.tsx`
- Resume view page: `src/app/my-resume/[resumeId]/page.tsx`
- Editor shell/context: `src/components/ResumeEditor.tsx`
- Form wizard: `src/components/FormSection.tsx`
- Preview: `src/components/ResumePreview.tsx`
- Create/delete cards:
  - `src/components/AddResume.tsx`
  - `src/components/ResumeCardItem.tsx`
- Server actions: `src/actions/resume.ts`

### Resume Creation
- `createResume(title)` inserts a new resume linked to current Prisma user.

### Resume Editing
- Section-level actions update personal details, summary, experience, education, and skills.
- Experience/education/skills use replace-all strategy (`deleteMany` + `createMany`) for simple synchronization.

### Resume Storage
- Main record in Prisma `Resume` table.
- Child rows in `Experience`, `Education`, and `Skill` tables.

### Resume Organization
- `getResume()` returns all user resumes ordered by newest first.
- Dashboard shows card grid for create, edit, view, delete actions.

### Multiple Resume Management
- Each user can own many resumes (`User` -> `Resume[]` relation).
- Each resume has independent title and section data.

### User Interaction Flow
1. User creates resume title.
2. User edits sections in form wizard.
3. Local context (`ResumeInfoContext`) updates live preview immediately.
4. Save actions persist section data server-side.
5. User opens printable resume view and can share link.

### Design Decisions
- Local UI state for responsiveness; explicit server writes for persistence.
- Strict ownership checks on every update action.
- AI enhancement is optional and user-triggered.

## 6.6 Technical Quiz and Performance Tracking

### Purpose
Provide measurable practice through MCQ-based assessments and trend analysis.

### Files
- Quiz logic: `src/components/Quiz.tsx`
- Result rendering: `src/components/QuizResult.tsx`
- Stats/trends: `src/components/StatsCards.tsx`, `src/components/PerformanceChart.tsx`, `src/components/QuizList.tsx`
- Actions: `src/actions/interview.ts`
- Pages:
  - `src/app/tools/interview-prep/mock/page.tsx`
  - `src/app/tools/interview-prep/page.tsx`

### Data Flow
1. Quiz questions generated based on user profile industry/skills.
2. User answers are scored client-side.
3. Result is saved server-side (`Assessment`), including question review payload and AI improvement tip.
4. Dashboard queries historical assessments and renders chart cards and history.

## 6.7 AI Roadmap Generator

### Purpose
Generate structured learning paths and display them as navigable graph nodes.

### Files
- Action: `src/actions/generate-roadmap.ts`
- Generator page: `src/app/tools/ai-roadmap-generator/page.tsx`
- Roadmap detail pages:
  - `src/app/tools/ai-roadmap-generator/[id]/page.tsx`
  - `src/app/(marketing)/ai-roadmap/history/[id]/page.tsx`
- History page: `src/app/(marketing)/ai-roadmap/history/page.tsx`
- Visualization: `src/components/RoadmapCanvas.tsx`, `src/components/TurboNode.tsx`, `src/components/RoadmapViewer.tsx`

### Data Flow
1. User requests roadmap for a title/role.
2. AI returns nodes/edges JSON.
3. Action validates basic structure, normalizes metadata, and stores in Prisma.
4. Viewer maps all nodes to custom `turbo` node type and renders in React Flow.

## 6.8 Industry Insights and Background Jobs

### Purpose
Show market context (salary bands, demand, trends) and keep data refreshed.

### Files
- Dashboard page: `src/app/tools/dashboard/page.tsx`
- Dashboard component: `src/components/DashboardView.tsx`
- User insights action: `src/actions/dashboard.ts`
- Inngest client/function:
  - `src/lib/inngest/client.ts`
  - `src/lib/inngest/functions.ts`
- Inngest route: `src/app/api/inngest/route.ts`

### Flow
- On first use, insights can be generated on demand (`generateAIInsights`) and upserted.
- Weekly cron (`generateIndustryInsights`) refreshes structured insights for `tech` industry.

## 6.9 Payments and Subscription Flow

### Purpose
Handle premium checkout and subscription status updates.

### Files
- Pricing page: `src/app/payement/dashboard/page.tsx`
- Subscription page: `src/app/payement/subscription/page.tsx`
- Checkout API: `src/app/api/stripe/checkout/route.ts`
- Webhook API: `src/app/api/stripe/webhook/route.ts`
- Stripe client/config: `src/lib/stripe.ts`
- Trigger component: `src/components/CheckoutButton.tsx`

### Flow
1. Client requests checkout URL from checkout API.
2. API creates/reuses Stripe customer and returns Stripe checkout session URL.
3. Stripe webhook updates MongoDB user plan/subscription window on create/update/delete events.
4. Subscription page reads user plan and renders status.

## 7. API Integrations Summary
- Groq API: interview questions, quiz questions, quiz tips, resume rewrites, roadmap generation, feedback generation
- VAPI: voice interview session runtime
- OpenAI-compatible client (Groq base URL) for chat streaming path
- Google Gemini: on-demand industry insights generation
- Stripe: checkout and webhook event processing
- Inngest: cron-based background AI insights refresh

## 8. UI/UX and Reusable Components

### Shared UI
- Radix-based primitives under `src/components/ui`
- Feedback toasts via `sonner`
- Chart and data cards (`DashboardView`, `PerformanceChart`, `StatsCards`)

### Feature Components
- Interview: `Agent.tsx`, `InterviewCard.tsx`, `StartInterviewButton.tsx`, `ViewInterviewButton.tsx`
- Chat: `ClearChatsButton.tsx`, `ClearChatsForm.tsx`, `EmptyState.tsx`
- Resume: form + preview components for each section
- Roadmap: `RoadmapViewer.tsx`, `RoadmapCanvas.tsx`, `TurboNode.tsx`

## 9. Hooks, Utilities, and Services

### Hooks
- `src/hooks/use-fetch.ts`: generic async wrapper for client calls with `loading`, `error`, `data`, and toast errors

### Utilities
- `src/lib/utils.ts`: className merge (`cn`), tech icon resolution, random interview cover selection
- `src/constants/index.ts`: mappings, VAPI assistant DTO, feedback schema, parser helpers

### Service Clients
- Prisma singleton: `src/lib/prisma.ts`
- Mongo connection/adapters: `src/lib/dbConnect.ts`, `src/lib/mongodb.ts`
- Groq client: `src/lib/groq.ts`
- Stripe client: `src/lib/stripe.ts`
- Inngest client: `src/lib/inngest/client.ts`
- VAPI web SDK instance: `src/lib/vapi.ts`

## 10. State Management

Current approach is lightweight and feature-scoped:
- Local component state (`useState`) for UI interactions
- Shared resume editing state via `ResumeInfoContext` in `src/context/ResumeInfoContest.tsx`
- Async request state managed via `useFetch`
- No global store library (Redux/Zustand) is used

## 11. Backend Logic Patterns
- All mutation actions enforce session checks and ownership checks
- Prisma transaction is used in onboarding update flow (`src/actions/user.ts`)
- Many AI outputs are normalized before persistence
- Server Actions are preferred for authenticated CRUD
- API routes are used for external callbacks/webhooks and streaming

## 12. Performance Considerations
- Prisma singleton to avoid excessive client instantiation in development
- Mongo connection reuse pattern in `dbConnect`
- Streaming response for chat to improve perceived latency
- Lightweight list/history queries with ordering/indexed fields in Prisma schema
- Replace-all writes for resume child tables simplify consistency at the cost of extra writes

## 13. Error Handling Strategies
- Try/catch wrapping in AI and payment workflows
- Early authorization guards with explicit errors or HTTP responses
- Validation:
  - Zod for onboarding schema and feedback output schema
  - Basic structural checks for AI roadmap JSON
- Defensive parsing/cleanup of model outputs before `JSON.parse`
- User-facing toast notifications for client-side failures

## 14. Known Implementation Notes
- Premium interview capability is intentionally admin-gated in current flow (`NEXT_PUBLIC_ADMIN_EMAIL` checks).
- Resume view currently uses browser print/share workflow (`window.print`, Web Share API) rather than explicit server-side PDF generation.
- Route middleware currently protects a subset of routes; additional protection exists in server-side handlers.

## 15. File Index for Critical Paths
- Root readme: `README.md`
- Prisma schema: `prisma/schema.prisma`
- Auth options: `src/app/api/auth/[...nextauth]/options.ts`
- Interview AI logic and persistence: `src/lib/action.ts`
- Resume actions: `src/actions/resume.ts`
- Quiz actions: `src/actions/interview.ts`
- Chat actions: `src/actions/ai-chat.ts`
- Roadmap actions: `src/actions/generate-roadmap.ts`
- Industry insights actions: `src/actions/dashboard.ts`
- Inngest cron function: `src/lib/inngest/functions.ts`
- Stripe checkout/webhook APIs:
  - `src/app/api/stripe/checkout/route.ts`
  - `src/app/api/stripe/webhook/route.ts`

## 16. Setup and Run (Technical)
1. Install dependencies: `npm install`
2. Configure `.env.local` with DB, auth, AI, VAPI, Stripe, and Inngest keys
3. Run DB migrations: `npx prisma migrate dev`
4. Start app: `npm run dev`
5. Optional Inngest local runner: `npx inngest-cli@latest dev`

This documentation reflects the implementation currently present in the repository and avoids claims beyond the existing code behavior.
