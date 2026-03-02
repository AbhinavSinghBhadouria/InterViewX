# InterviewX 🎤🤖

**Transform your interview preparation with AI-powered mock interviews, intelligent resume building, and personalized career guidance.**

---

## 🎯 The Problem

Job seekers and professionals face critical challenges in interview preparation:
- **Lack of realistic practice** - Limited access to diverse interview scenarios and real-time feedback
- **Uncertainty about resume quality** - Don't know if their resume effectively showcases their skills to recruiters
- **No personalized guidance** - Generic career advice doesn't address individual strengths and weaknesses
- **Isolated learning** - No integrated platform to manage resumes, track progress, and receive actionable insights
- **Fear of the unknown** - Mock interview anxiety due to limited practice opportunities

---

## 💡 The Solution: InterviewX

InterviewX is an **AI-powered interview simulation and career development platform** that combines:

### 🎙️ **AI Voice Interviewer**
Practice realistic mock interviews with our AI interviewer powered by **VAPI**. Get instant feedback, track your performance metrics, and improve with each session.

### 🤖 **AI Career Coach**
Your personal AI career advisor powered by **Inngest Agent Kit** provides:
- Personalized career guidance tailored to your industry and skills
- Real-time answers to interview preparation questions
- Context-aware advice based on your profile and experience
- Continuous support throughout your job search journey

### 📄 **Intelligent Resume Builder**
- Create unlimited professionally formatted resumes
- AI-powered improvements for your summary and experience descriptions
- Live preview with ATS-friendly formatting
- Export to PDF or DOCX with a single click
- Industry-specific optimization suggestions

### 📊 **Smart Progress Tracking**
- Track interview performance over time with visual analytics
- Identify weak areas and get personalized improvement tips
- Measure skill development with detailed assessment reports
- Monitor career growth with actionable insights

### 💼 **Industry Insights Dashboard**
- Real-time salary data and market trends for your industry
- Growth rates and market demand for your target roles
- Skill gap analysis with recommendations
- Data-driven career planning information

---

## 🤖 How AI Powers Your Success

### AI Interview Simulation
**VAPI Voice Agent** conducts realistic mock interviews:
- Responds naturally to your answers
- Asks follow-up questions based on your responses
- Provides constructive, detailed feedback after each session
- Helps you build confidence through repeated practice

### Intelligent Content Enhancement
**AI-powered resume improvements**:
- Analyzes your professional summary and experience descriptions
- Suggests improvements that highlight your achievements
- Maintains ATS compatibility and professional tone
- Saves time while ensuring quality content

### Personalized Career Guidance
**Inngest Agent Kit**-powered AI advisor:
- Understands your unique career situation
- Provides context-aware guidance for interview preparation
- Suggests salary negotiation strategies
- Recommends skill development paths

### Adaptive Learning
- Progress tracking helps identify improvement areas
- AI generates personalized quiz questions based on your industry and skills
- Adaptive difficulty that grows with your proficiency

---

## ✨ Key Features

| Feature | Benefit |
|---------|---------|
| 🎤 **Voice-Based Mock Interviews** | Practice real-world communication and think-on-your-feet skills |
| 🤖 **AI Career Coach** | Get 24/7 personalized career advice and interview prep tips |
| 📄 **Multiple Resume Management** | Create industry-specific resumes for different roles |
| 📊 **Performance Analytics** | Visualize your progress and track improvement areas |
| 💼 **Industry Insights** | Access real-time salary data and market trends |
| 💾 **PDF/DOCX Export** | Download resumes in your preferred format |
| 🔐 **Secure Authentication** | Multi-provider login (Email, Google, GitHub) |
| 💳 **Premium Features** | Unlock advanced capabilities with flexible pricing |

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file with required API keys:
```env
# Databases
MONGODB_URI=your_mongodb_connection
DATABASE_URL=your_postgresql_connection

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# AI Services
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id
INNGEST_EVENT_KEY=your_inngest_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret

# Payment (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

### 3. Database Setup
```bash
npx prisma migrate dev
```

### 4. Run Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** to get started!

---

## 🏗️ Tech Stack

**Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS  
**Backend**: Next.js App Router, Server Actions, API Routes  
**Databases**: MongoDB (Auth), PostgreSQL (Application Data)  
**AI/ML**: VAPI (Voice Interviews), Inngest (Career Agent), Groq & OpenAI (AI Improvements)  
**Payments**: Stripe Integration  
**Deployment**: Vercel  

---

## 📈 Why InterviewX Wins

✅ **All-in-one platform** - No need for multiple tools  
✅ **AI-powered feedback** - Get actionable insights beyond generic tips  
✅ **Real-time practice** - Voice-based interviews feel like real conversations  
✅ **Career-focused** - Not just interview prep, but holistic career development  
✅ **Data-driven growth** - Track progress with detailed analytics  
✅ **Professional output** - ATS-optimized resumes and polished portfolios  

---

## 📚 For More Details

See [ComprehensiveREADME.md](./ComprehensiveREADME.md) for:
- Detailed architecture overview
- Complete project structure
- API documentation
- Deployment guidelines
- Contributing guidelines

---

## 📄 License

This project is private and proprietary.

---

**Built by AMBER HASAN**

*Ready to ace your next interview? Let InterviewX help you succeed! 🚀*
