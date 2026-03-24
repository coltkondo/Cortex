# Cortex - Career Second Brain

## What is Cortex?

Cortex is a full-stack web application that helps job seekers manage their application process by leveraging AI. It analyzes job descriptions against a user's resume, generates tailored materials, and tracks applications through a pipeline.

**Core value proposition**: Put your resume at the center and let AI do the analytical heavy lifting - fit scoring, positioning suggestions, interview prep - all grounded in your actual experience.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: Google Gemini API (gemini-2.5-flash model)
- **PDF Processing**: pdf-parse
- **Database**: SQLite (development) → PostgreSQL (production)
- **ORM**: TypeORM
- **State Management**: Zustand
- **Deployment**: Railway or Render

## Project Structure

```
cortex/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   └── api/           # API client
│   └── public/
├── backend-ts/        # Express + TypeScript API
│   ├── src/
│   │   ├── config/        # Database & env config
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic & AI integration
│   │   ├── models/        # TypeORM entities
│   │   └── utils/         # PDF parsing, helpers
│   └── package.json
└── docs/              # Additional documentation
```

## Core Features (5 Total)

1. **JD vs Resume Fit Scoring** - Compare job descriptions against resume with scored breakdown
2. **Tailored Bullet Suggestions** - AI-generated resume bullets aligned to specific JD language
3. **Cover Letter Drafting** - Targeted cover letters grounded in resume + JD
4. **Application Pipeline Tracker** - Kanban-style board tracking application lifecycle
5. **Interview Prep per JD** - Generate STAR-ready answers and prep questions per role

## How to Work on Cortex

### Running the Project

**Backend:**
```bash
cd backend-ts
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the `backend-ts/` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_PATH=./cortex.db
PORT=8000
CORS_ORIGINS=http://localhost:5173
```

Get your free Gemini API key from: https://aistudio.google.com/app/apikey

### Testing & Verification

- **Backend dev**: `npm run dev` from `backend-ts/` (hot reload with tsx)
- **Type checking**: `npm run typecheck` from `backend-ts/`
- **Frontend build**: `npm run build` from `frontend/`

### Working with AI Integration

All AI API calls follow this pattern:
- **Input**: (resume text) + (job description text) + (task-specific prompt)
- **Resume storage**: Parsed resume text is stored once in the DB and reused across all calls
- **Output**: Structured responses (fit scores, bullet suggestions, cover letters, interview prep)
- **Mock mode**: Automatically enabled when no API key configured - returns realistic dummy data
- **AI Provider**: Currently using Google Gemini API (free tier: 60 requests/minute)

Each feature has a dedicated service module in `backend-ts/src/services/claude/`:
- `fitScoring.ts` - Analyze match percentage and skill gaps
- `bulletSuggestions.ts` - Generate tailored resume bullets
- `coverLetter.ts` - Draft professional cover letters
- `interviewPrep.ts` - Create interview prep sheets

The AI abstraction layer in `backend-ts/src/services/ai/` allows easy switching between providers.

## Development Phases

**Phase 1 (Weeks 1-2)**: Core engine - PDF upload, parsing, resume storage, JD input, fit scoring
**Phase 2 (Weeks 2-3)**: AI features - bullet suggestions, cover letters, interview prep
**Phase 3 (Week 4)**: Pipeline tracker, deployment

## Key Design Decisions

- **Single-user auth**: MVP is local-first, no complex auth system
- **Resume as source of truth**: Parsed once, reused across all AI calls to minimize API costs
- **Stateful application records**: All AI outputs (bullets, letters, prep) are saved and linked to their specific job application
- **TypeScript backend**: Uses npm (same as frontend), better compatibility with restricted networks
- **Mock mode by default**: Zero friction development without API key required

## Important Notes

- This is a portfolio project built during active job search - the narrative is: "I built the tool I needed while using it"
- Focus on shipping a working MVP fast - avoid over-engineering
- The AI integration should demonstrate structured prompting and JSON responses, not just a chatbot wrapper
- Keep the UX simple and focused on the five core features
