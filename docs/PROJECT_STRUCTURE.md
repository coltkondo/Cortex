# Cortex Project Structure

## Overview

Cortex is organized into three main parts:
1. **frontend/** - React application (user interface)
2. **backend-ts/** - Express + TypeScript API
3. **docs/** - Documentation

## Directory Tree

```
cortex/
│
├── frontend/                      # React Application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── common/            # Layout, shared UI, premium components
│   │   │   ├── resume/            # Resume upload
│   │   │   ├── jobs/              # Job input
│   │   │   ├── analysis/          # AI analysis sections (fit score, bullets, cover letter)
│   │   │   └── pipeline/          # Kanban board
│   │   ├── pages/                 # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   └── PipelinePage.jsx
│   │   ├── store/                 # Zustand state
│   │   │   └── useStore.js
│   │   ├── api/                   # API client
│   │   │   ├── client.js
│   │   │   ├── resumeService.js
│   │   │   ├── jobService.js
│   │   │   └── analysisService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .gitignore
│
├── backend-ts/                    # Express + TypeScript API
│   ├── src/
│   │   ├── config/                # Configuration
│   │   │   ├── database.ts        # TypeORM setup
│   │   │   └── env.ts             # Environment variables
│   │   ├── models/                # Database entities
│   │   │   ├── Resume.ts
│   │   │   ├── Job.ts
│   │   │   ├── Application.ts
│   │   │   └── GeneratedContent.ts
│   │   ├── routes/                # API endpoints
│   │   │   ├── resume.ts          # POST /upload, GET, DELETE
│   │   │   ├── jobs.ts            # CRUD operations
│   │   │   └── analysis.ts        # AI features
│   │   ├── services/              # Business logic
│   │   │   └── claude/            # Claude API integration
│   │   │       ├── client.ts      # Client initialization
│   │   │       ├── mockClient.ts  # Mock service
│   │   │       ├── fitScoring.ts
│   │   │       ├── bulletSuggestions.ts
│   │   │       ├── coverLetter.ts
│   │   │       └── interviewPrep.ts
│   │   ├── utils/                 # Utilities
│   │   │   └── pdfParser.ts       # PDF text extraction
│   │   └── index.ts               # Express app entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── docs/                          # Documentation
│   └── PROJECT_STRUCTURE.md       # This file
│
├── CLAUDE.md                      # AI agent guide
├── README.md                      # Main documentation
└── GETTING_STARTED.md             # Quick start guide
```

## Key Files

### Frontend Entry Points
- **frontend/src/main.jsx** - Application entry point
- **frontend/src/App.jsx** - Root component with routing
- **frontend/src/store/useStore.js** - Global state management

### Backend Entry Points
- **backend-ts/src/index.ts** - Express server initialization
- **backend-ts/src/config/database.ts** - Database connection
- **backend-ts/src/services/claude/client.ts** - Claude API client

### Configuration
- **frontend/vite.config.js** - Vite configuration
- **frontend/tailwind.config.js** - Tailwind CSS configuration
- **backend-ts/tsconfig.json** - TypeScript configuration
- **backend-ts/.env.example** - Environment variables template

## Data Flow

1. **User uploads PDF** → Frontend → `/api/resume/upload` → Backend extracts text → Saves to DB
2. **User adds job** → Frontend → `/api/jobs` → Backend creates job record
3. **User analyzes fit** → Frontend → `/api/analysis/fit-score/:id` → Backend calls Claude API → Returns analysis
4. **User generates content** → Frontend → `/api/analysis/bullets|cover-letter|interview-prep/:id` → Backend calls Claude → Returns generated content

## API Endpoints

All endpoints are prefixed with `/api`:

**Resume:**
- `POST /resume/upload` - Upload PDF
- `GET /resume` - Get current resume
- `DELETE /resume` - Delete resume

**Jobs:**
- `POST /jobs` - Create job
- `GET /jobs` - List all jobs
- `GET /jobs/:id` - Get specific job
- `PATCH /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

**Analysis (AI Features):**
- `POST /analysis/fit-score/:jobId` - Analyze fit
- `POST /analysis/bullets/:jobId` - Generate bullets
- `POST /analysis/cover-letter/:jobId` - Generate cover letter
- `POST /analysis/interview-prep/:jobId` - Generate interview prep

## Database Schema

**resumes**
- id, filename, content, experienceSection, skillsSection, educationSection, projectsSection, uploadedAt, updatedAt

**jobs**
- id, company, role, description, source, companyStage, createdAt, updatedAt

**applications**
- id, jobId, stage, appliedDate, screenDate, interviewDate, offerDate, notes, createdAt, updatedAt

**generated_content**
- id, jobId, contentType, content, createdAt, updatedAt

## Component Structure

Frontend components follow this pattern:
```jsx
ComponentName/
  ├── ComponentName.jsx       # Main component
  └── styles (if needed)      # Component-specific styles
```

State management with Zustand:
```javascript
useStore.js exports:
  - resume, setResume
  - jobs, addJob, updateJob, removeJob
  - applications, addApplication, updateApplication
  - generatedContent, setGeneratedContent
  - loading, setLoading
  - error, setError
```

## Adding New Features

To add a new AI feature:
1. Create service in `backend-ts/src/services/claude/yourFeature.ts`
2. Add route in `backend-ts/src/routes/analysis.ts`
3. Create API service in `frontend/src/api/analysisService.js`
4. Create component in `frontend/src/components/generator/YourFeature.jsx`
5. Add to AnalysisPage

## Notes

- Frontend uses Vite for fast dev server and hot module reload
- Backend uses tsx for TypeScript hot reload
- Database auto-syncs schema on startup (TypeORM synchronize: true)
- PDF parsing happens on backend to avoid CORS issues
- All AI calls go through backend to protect API key
