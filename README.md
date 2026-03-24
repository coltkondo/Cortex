# Cortex

> A career second brain for the active job seeker

Cortex is a full-stack web application that helps you manage your job search by leveraging AI to analyze job descriptions, tailor your application materials, and prepare for interviews — all grounded in your actual resume.

## What Does Cortex Do?

Job searching is chaotic by default. You're applying to multiple roles, tailoring your story each time, trying to remember what you said in each cover letter, and somehow also prepping for interviews. Cortex puts your resume at the center and automates the analytical heavy lifting.

### Five Core Features

1. **📊 JD vs Resume Fit Scoring**
   - Paste a job description and get an instant scored breakdown
   - Overall match percentage with reasoning
   - Skill gap analysis (what you have vs what they want)
   - Experience level alignment check
   - Red flags or stretch concerns flagged
   - Company stage fit assessment

2. **✍️ Tailored Bullet Suggestions**
   - AI rewrites or suggests new resume bullets
   - Aligned with specific JD language and priorities
   - Side-by-side: original vs suggested
   - One-click copy to clipboard

3. **📝 Cover Letter Drafting**
   - Generate targeted cover letters grounded in your resume and the JD
   - Tone selector: formal / conversational
   - Editable in-app before export
   - Saved per application for reference

4. **📋 Application Pipeline Tracker**
   - Kanban-style board tracking every role
   - Stages: Saved → Applied → Screen → Interview → Offer
   - Date tracking + days-in-stage indicator
   - Notes field per application
   - All AI outputs linked to each role
   - Export to CSV

5. **🎯 Interview Prep per JD**
   - Tailored prep sheet for each role
   - Likely behavioral questions based on JD
   - STAR-ready answers using your own resume bullets
   - Technical concepts to brush up on
   - Questions to ask the interviewer
   - Company-specific context prompts

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: Google Gemini API (gemini-2.5-flash)
- **PDF Processing**: pdf-parse
- **Database**: SQLite (dev) → PostgreSQL (prod)
- **ORM**: TypeORM
- **State Management**: Zustand
- **Hosting**: Railway or Render

## Quick Start

> **📖 New to the project?** See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed setup instructions!

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([get one free here](https://aistudio.google.com/app/apikey)) - **Optional!** App includes mock mode for local development

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cortex.git
   cd cortex
   ```

2. **Set up the backend**
   ```bash
   cd backend-ts
   npm install
   cp .env.example .env
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the application**

   Terminal 1 - Backend:
   ```bash
   cd backend-ts
   npm run dev
   ```

   Terminal 2 - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open the app**

   Navigate to `http://localhost:5173` in your browser.

## Project Structure

```
cortex/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── common/       # Reusable UI components
│   │   │   ├── resume/       # Resume upload & display
│   │   │   ├── jobs/         # Job description input
│   │   │   ├── analysis/     # Fit scoring results
│   │   │   ├── generator/    # Content generators
│   │   │   └── pipeline/     # Kanban board tracker
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state management
│   │   ├── api/              # API client & services
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   └── package.json
│
├── backend-ts/               # Express + TypeScript API
│   ├── src/
│   │   ├── config/           # Database & env config
│   │   ├── routes/           # API endpoints
│   │   │   ├── resume.ts     # Resume endpoints
│   │   │   ├── jobs.ts       # Job CRUD
│   │   │   └── analysis.ts   # AI features
│   │   ├── services/         # Business logic
│   │   │   ├── ai/           # AI abstraction layer
│   │   │   └── claude/       # Feature service modules
│   │   ├── models/           # TypeORM entities
│   │   ├── utils/            # PDF parser, helpers
│   │   └── index.ts          # Express app
│   └── package.json
│
├── docs/                     # Documentation
│   ├── spec.md               # Original project spec
│   └── PROJECT_STRUCTURE.md  # Detailed structure guide
├── CLAUDE.md                 # Agent onboarding file
├── README.md                 # This file
└── GETTING_STARTED.md        # Quick start guide
```

## Environment Variables

### Backend (`backend-ts/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key. Leave empty to use **mock mode** (no API calls) | No | `` |
| `USE_MOCK_AI` | Force mock mode even with valid API key | No | `false` |
| `DATABASE_PATH` | SQLite database file path | No | `./cortex.db` |
| `PORT` | Backend server port | No | `8000` |
| `NODE_ENV` | Environment (development/production) | No | `development` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | No | `http://localhost:5173` |

> **💡 Mock Mode**: The app automatically uses mock AI responses when no API key is configured. Perfect for local development, demos, and portfolio showcase!
> **🆓 Free Tier**: Gemini provides 60 requests/minute for free, making it perfect for this use case!

### Frontend (optional, `frontend/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | No | `http://localhost:8000` |

## Development

### Backend

```bash
cd backend-ts
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run typecheck    # Type checking
```

### Frontend

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Roadmap

- [x] Project specification and architecture
- [x] TypeScript backend implementation
- [x] React frontend with all 5 features
- [x] Mock Claude service for development
- [ ] Phase 1: Complete MVP testing
- [ ] Phase 2: Production deployment
- [ ] Phase 3: Pipeline tracker enhancements
- [ ] Stretch: Pattern detection across applications
- [ ] Stretch: Referral tracking and conversion analysis
- [ ] Stretch: LeetCode problem category suggestions

## Why I Built This

I built Cortex during my own job search. I noticed I was doing the same analysis manually for every role — comparing my resume to the JD, rewriting bullets, drafting cover letters. So I automated it.

This project demonstrates:
- **Product thinking**: Identified a real problem and scoped a solution
- **AI integration**: Structured AI prompting with real outputs (not just a chatbot wrapper)
- **Full-stack development**: React frontend + TypeScript backend + deployed application
- **Self-aware building**: Built the tool I needed while actively using it

## Tech Decisions

**Why TypeScript backend instead of Python?**
- ✅ Single package manager (npm) for both frontend and backend
- ✅ Better compatibility with restricted networks
- ✅ Type safety similar to Python with Pydantic
- ✅ Easier deployment (Node.js is ubiquitous)

**Why mock mode by default?**
- ✅ Zero friction for development and demos
- ✅ No API costs during frontend development
- ✅ Works immediately without external dependencies
- ✅ Easy to switch to real API when ready

## License

MIT

## Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Quick setup guide
- **[CLAUDE.md](CLAUDE.md)** - Codebase guide for AI agents
- **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Detailed architecture
- **[docs/spec.md](docs/spec.md)** - Original project specification
- **[backend-ts/README.md](backend-ts/README.md)** - Backend documentation

## Contact

Built by [Your Name] | [GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourprofile)

---

**🤖 Generated with Claude · March 2026**
