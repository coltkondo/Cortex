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

## Core Features (6 Total)

1. **JD vs Resume Fit Scoring** - Compare job descriptions against resume with scored breakdown
2. **Tailored Bullet Suggestions** - AI-generated resume bullets aligned to specific JD language
3. **Cover Letter Drafting** - Targeted cover letters grounded in resume + JD
4. **Application Pipeline Tracker** - Kanban-style board tracking application lifecycle
5. **Interview Prep per JD** - Generate STAR-ready answers and prep questions per role
6. **LaTeX Resume Editor** - Edit, preview, and compile LaTeX resumes to professional PDFs

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
- Keep the UX simple and focused on the core features

## LaTeX Resume Editor (New Feature)

### Overview
The LaTeX Resume Editor allows users to edit resumes in LaTeX format with real-time PDF preview and download capability.

### How It Works
1. Users edit LaTeX in a code editor with split-view layout
2. PDF preview appears on the right side
3. Click "Refresh PDF" to compile and preview changes
4. Download compiled PDF or save LaTeX to database for later editing

### Implementation Details

**Backend Components:**
- `backend-ts/src/utils/latexCompiler.ts` - LaTeX to PDF compilation
- `backend-ts/src/routes/resume.ts` - API endpoints for LaTeX operations
- `backend-ts/src/models/Resume.ts` - Added `latexContent` field to store LaTeX

**Frontend Components:**
- `frontend/src/components/resume/ResumeLatexEditor.jsx` - Main editor component
- `frontend/src/pages/ResumePage.jsx` - Added LaTeX tab integration
- `frontend/src/api/resumeService.js` - API methods for LaTeX operations

**API Endpoints:**
```
GET    /api/resume/latex/content   - Fetch stored LaTeX
POST   /api/resume/latex/save      - Save LaTeX to database
POST   /api/resume/latex/compile   - Compile LaTeX to PDF (preview)
POST   /api/resume/latex/download  - Compile and download PDF
```

**LaTeX Compilation:**
- Uses `pdflatex` if available on system
- Falls back to mock PDF for development
- Validates LaTeX structure before compilation
- Auto-cleanup of temporary files

### Features
- ✅ Live LaTeX editing with character counter
- ✅ Real-time PDF preview (iframe-based)
- ✅ One-click PDF download
- ✅ Save/load LaTeX from database
- ✅ Default template available
- ✅ LaTeX validation (basic syntax checking)
- ✅ Dark mode support
- ✅ Error reporting with helpful messages
- ✅ Copy LaTeX to clipboard

### Usage
See `docs/LATEX_EDITOR.md` for complete documentation and user guide.

---

# Code Standards & Patterns

*This section documents established patterns, standards, and lessons learned during development. Update this in real-time as you build.*

## Configuration Management

### NEVER Hardcode Values
**Established:** March 24, 2026

All hardcoded values MUST be extracted to configuration files. See [VERSION_HISTORY.md](VERSION_HISTORY.md) (v1.3 Configuration Overhaul) for full details.

**Frontend Configuration Files:**
- `frontend/src/config/constants.js` - Application constants, validation rules, messages
- `frontend/src/config/theme.js` - Color palettes, animation durations, design tokens

**Backend Configuration Files:**
- `backend-ts/src/config/constants.ts` - HTTP config, timeouts, validation rules, error messages
- `backend-ts/src/config/env.ts` - Environment variables

**Examples:**
```javascript
// ❌ BAD - Hardcoded
if (description.length < 50) {
  setError('Please enter at least 50 characters')
}

// ✅ GOOD - Using constants
import { VALIDATION, MESSAGES } from '../../config/constants'

if (description.length < VALIDATION.MIN_DESCRIPTION_LENGTH) {
  setError(MESSAGES.ERROR_MISSING_FIELDS)
}
```

**Rules:**
1. No magic numbers in components or routes
2. All user-facing strings must be in `MESSAGES` constant
3. All timeouts, limits, and thresholds in config files
4. Color hex values documented with references to theme
5. API endpoints and URLs via environment variables

## Naming Conventions

### Variable Naming Standards
**Established:** March 24, 2026

See [VERSION_HISTORY.md](VERSION_HISTORY.md) (v1.3 Naming Conventions) for complete audit results.

**NEVER use vague variable names:**
- ❌ `data`, `result`, `item`, `val`, `temp`, `tmp`, `stuff`, `thing`

**ALWAYS use descriptive names:**
- ✅ `fitScoreAnalysis`, `bulletResponse`, `uploadedResume`, `parsedPdfData`

**Acceptable Generic Names:**
- `req`, `res` - Express route handlers (convention)
- `err`, `error` - Catch blocks (standard)
- `response.data` - Axios responses (library convention)
- `idx` - Map functions (when scope < 5 lines)

**Naming Patterns:**
```javascript
// API responses - describe what they contain
const fitScoreAnalysis = await analysisService.analyzeFit(jobId)
const bulletResponse = await analysisService.generateBullets(jobId)
const uploadedResume = await resumeService.uploadResume(file)

// Boolean variables - ask questions
const isLoading = true
const hasErrors = false
const shouldFetch = true

// Arrays - use plural
const jobs = []
const bullets = []
const steps = []

// Event handlers - describe action
const handleSubmit = () => {}
const onUploadComplete = () => {}
const validateInput = () => {}
```

## Component Patterns

### React Component Structure
**Established:** March 2026

All React components follow this structure:

```javascript
// 1. Imports
import { useState } from 'react'
import { Icon } from 'lucide-react'
import { CONSTANTS } from '../../config/constants'

// 2. Component function
function ComponentName({ prop1, prop2 }) {
  // 3. State declarations
  const [state, setState] = useState(null)

  // 4. Helper functions
  const helperFunction = () => {}

  // 5. Effects (if needed)
  useEffect(() => {}, [dependencies])

  // 6. Return JSX
  return (
    <div>...</div>
  )
}

// 7. Export
export default ComponentName
```

### Component Organization
- One component per file
- File name matches component name exactly
- Components in `frontend/src/components/` organized by feature:
  - `analysis/` - Fit score and analysis components
  - `generator/` - Content generation components (bullets, cover letter, interview prep)
  - `jobs/` - Job description input components
  - `resume/` - Resume upload components
  - `common/` - Reusable UI components (Badge, ProgressRing, EmptyState, Layout)
  - `pipeline/` - Pipeline board components

## API & Backend Patterns

### Route Handler Structure
**Pattern Established:** TypeScript + Express conventions

```typescript
router.post('/endpoint/:param', async (req, res) => {
  try {
    // 1. Get repositories
    const repo = AppDataSource.getRepository(Entity)

    // 2. Fetch required data
    const entity = await repo.findOne({ where: { id: req.params.param } })

    // 3. Validation
    if (!entity) {
      return res.status(404).json({ detail: 'Not found' })
    }

    // 4. Business logic with descriptive variable names
    const specificResult = await serviceFunction(entity.data)

    // 5. Return response
    res.json({
      id: entity.id,
      ...specificResult,
    })
  } catch (error: any) {
    res.status(500).json({ detail: error.message })
  }
})
```

### Error Messages
**Standard:** All error messages come from `backend-ts/src/config/constants.ts`

```typescript
// Use constants, not hardcoded strings
throw new Error(ERROR_MESSAGES.URL_NOT_FOUND)
throw new Error(ERROR_MESSAGES.INSUFFICIENT_CONTENT)
```

## AI Integration Patterns

### Gemini API Usage
**Current Provider:** Google Gemini API (gemini-2.5-flash)

**Key Facts:**
- Free tier: 60 requests/minute
- Model: `gemini-2.5-flash` (fast, cost-effective)
- Alternative models tested: gemini-2.0-flash-exp ❌, gemini-1.5-flash ❌, gemini-1.5-pro ❌
- **Working model:** gemini-2.5-flash ✅

**Pattern:**
```typescript
// AI client abstraction allows easy provider switching
const aiGenerationResult = await this.model.generateContent({
  contents: [{ role: 'user', parts: [{ text: userMessage }] }],
  generationConfig: {
    maxOutputTokens: params.max_tokens || 4096,
    temperature: params.temperature || 0.7,
  },
})
```

**Mock Mode:**
- Enabled automatically when `GEMINI_API_KEY` is missing or empty
- Returns realistic dummy data for all AI operations
- Located in `backend-ts/src/services/claude/mockClient.ts`

## UX & Design Patterns

### Visual Feedback Standards
**Established:** March 2026 UX overhaul

See [VERSION_HISTORY.md](VERSION_HISTORY.md) (v1.2 UX Enhancement) for complete rationale.

**Progressive Disclosure:**
- Step 2 (Add Job) locked until Step 1 (Upload Resume) complete
- Empty states with helpful guidance when features locked
- Clear visual hierarchy guides user attention

**Real-time Validation:**
- Green highlights for valid form fields
- Character counters with color-coded feedback
- Inline error messages from `MESSAGES` constant

**Status Indicators:**
- Match quality badges (Excellent/Good/Moderate/Poor)
- Loading states with spinners and descriptive text
- Success notifications with auto-dismiss (3 seconds from `TIMING` constant)

**Data Visualization:**
- Circular progress rings for scores (sizes from `SIZES` constant)
- Color psychology: Green=success, Blue=primary, Yellow=warning, Red=error
- Icons from lucide-react for consistency

**Component Sizes:**
```javascript
// From frontend/src/config/constants.js
SIZES.PROGRESS_RING_DEFAULT = 120
SIZES.PROGRESS_RING_LARGE = 160
SIZES.PROGRESS_RING_STROKE_DEFAULT = 8
SIZES.PROGRESS_RING_STROKE_LARGE = 12
```

## Known Issues & Solutions

### Issue: Gemini Model Availability
**Date:** March 2026
**Problem:** Several Gemini model names return 404 errors
**Tested:**
- ❌ `gemini-2.0-flash-exp` - 404 error
- ❌ `gemini-1.5-flash` - 404 error
- ❌ `gemini-1.5-pro` - 404 error
- ✅ `gemini-2.5-flash` - WORKS

**Solution:** Always use `gemini-2.5-flash` model name. Update `backend-ts/src/services/ai/geminiClient.ts` line 16 if model changes.

### Issue: Skill Matching False Positives
**Date:** March 26, 2026
**Problem:** Missing keywords section showed skills as missing when they were present in resume (React, TypeScript, K8s, etc.)
**Root Causes:**
1. Limited skill pattern recognition - original extractSkills had ~40 skills
2. Strict fuzzy matching - >0.7 Levenshtein threshold too high for aliases
3. No skill normalization - "k8s" vs "kubernetes" not recognized as identical
4. Field name mismatch - Frontend was reading wrong response field

**Solved April 2026:**
1. Expanded extractSkills to 80+ technologies with common variations
2. Implemented skill aliases mapping (k8s→kubernetes, node.js→nodejs, etc.)
3. Two-tier matching: exact-match-on-normalized first, then fuzzy at >0.6 threshold
4. Fixed frontend component to read correct `skill_gaps` field from backend
5. Created detailed documentation in SKILL_MATCHING_IMPROVEMENTS.md

**Status:** ✅ RESOLVED - Matching accuracy improved significantly

### Issue: TypeScript Compilation with Constants
**Date:** March 2026
**Problem:** Large constant files can slow down TypeScript compilation
**Solution:**
- Keep constants organized by category
- Use `const` exports, not `export default`
- Run `npm run typecheck` regularly to catch issues early

### Issue: CSS Hex Colors in Tailwind
**Date:** March 2026
**Problem:** Hex colors in custom CSS don't match Tailwind theme
**Solution:**
- Document all hex colors with theme references
- Example: `#4f46e5 /* COLORS.FOCUS_RING / theme primary-600 */`
- Keep color values in sync between `theme.js` and custom CSS

## Scaling & Performance

### Architecture Limits at Scale
**Documented:** March 24, 2026

See [SCALING_RISKS.md](SCALING_RISKS.md) for complete analysis of breaking points at 10,000 DAU.

**Critical bottlenecks identified:**
1. **SQLite database** - Locks on writes, limited concurrency → **Migrate to PostgreSQL**
2. **No AI caching** - Every request hits API, expensive → **Add Redis cache layer**
3. **No rate limiting** - Vulnerable to DOS, cost explosion → **Implement express-rate-limit**
4. **Synchronous AI calls** - Blocks event loop, poor UX → **Use Bull queue + background workers**
5. **Missing indexes** - Queries slow as data grows → **Add strategic indexes on foreign keys**

**Performance targets for 10K DAU:**
- Response time P95: < 500ms (with cache)
- Cache hit rate: 70-90%
- Error rate: < 1%
- AI API calls: < 10K/day (90% reduction via caching)
- Cost per user: < $0.02/day

**Implementation priority:**
1. Redis caching (Week 1) - Biggest cost/performance win
2. Rate limiting (Week 1) - Prevents abuse
3. PostgreSQL (Week 2) - Prepares for scale
4. Database indexes (Week 2) - Prevents slowdown
5. Async jobs (Week 3-4) - Best UX

## Deployment Standards

### Pre-Deployment Checklist
**Run before every deployment:**

```bash
# Backend
cd backend-ts
npm run typecheck    # Must pass with 0 errors
npm run build       # Must compile successfully

# Frontend
cd frontend
npm run build       # Must build successfully
```

### Environment Variables
**Production requirements:**
- `GEMINI_API_KEY` - Required for AI features
- `NODE_ENV=production` - Enables production optimizations
- `DATABASE_PATH` or `DATABASE_URL` - For persistent storage
- `CORS_ORIGINS` - Only allow production domains
- `PORT` - Default 8000, can be overridden

See [SCALING_RISKS.md](SCALING_RISKS.md) for production deployment and scaling considerations.

## Code Review Standards

### Before Committing Code
**Check for:**
- [ ] No vague variable names (`data`, `result`, `temp`, `item`, `val`)
- [ ] No hardcoded strings (use `MESSAGES` constant)
- [ ] No magic numbers (use `VALIDATION`, `TIMING`, `SIZES` constants)
- [ ] No hardcoded colors (use theme or document with comments)
- [ ] No hardcoded timeouts (use `TIMING` or `HTTP_CONFIG`)
- [ ] All imports organized (constants at top, components below)
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] No console.logs in production code (use proper logging)

### Git Commit Standards
**Message format:**
```
<type>: <description>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

**Types:** feat, fix, refactor, docs, style, test, chore

**Examples:**
```
feat: add URL fetching for job descriptions
fix: replace vague variable names with descriptive alternatives
refactor: extract hardcoded values to configuration files
docs: add naming conventions to CLAUDE.md
```

## Documentation Standards

### Keep These Files Updated
**After every significant change:**
- `CLAUDE.md` - This file, add new patterns and learnings
- `VERSION_HISTORY.md` - Document major updates and version changes
- `SCALING_RISKS.md` - Update when addressing scaling bottlenecks

### Documentation Style
- Use markdown with proper headers
- Include code examples for patterns
- Add "Established: [Date]" for new patterns
- Use ✅ ❌ ⚠️ symbols for quick scanning
- Keep "Before/After" examples for clarity

## Update Standards

### When Adding New Features
1. **Create constants first** - Add to config files before writing component
2. **Use descriptive variable names** - Review naming audit before coding
3. **Follow component structure** - Match existing patterns
4. **Update this file** - Add patterns, gotchas, or learnings
5. **Run type checking** - `npm run typecheck` before committing

### When Fixing Bugs
1. **Document the bug** - Add to "Known Issues & Solutions" section
2. **Document the fix** - Explain why it happened and how to prevent it
3. **Update related docs** - If fix changes patterns, update guides
4. **Add to review checklist** - If bug was preventable, add check

### When Refactoring
1. **Maintain consistency** - Don't introduce new patterns without documenting
2. **Update all instances** - Search for similar patterns and update them all
3. **Update configuration** - If extracting hardcoded values, update config docs
4. **Test thoroughly** - Run typecheck, build, and manual testing

---

## Quick Reference

### File Locations Cheat Sheet
```
Configuration:
  frontend/src/config/constants.js   - App constants, messages, validation
  frontend/src/config/theme.js       - Colors, animations, design tokens
  backend-ts/src/config/constants.ts - Backend config, error messages
  backend-ts/src/config/env.ts       - Environment variables

Documentation:
  README.md                          - Project overview and quick start
  CLAUDE.md                          - This file (patterns & standards)
  GETTING_STARTED.md                 - Detailed setup guide
  SCALING_RISKS.md                   - Scaling analysis & fixes for 10K DAU
  VERSION_HISTORY.md                 - Version updates and changelog

Key Components:
  frontend/src/components/common/    - Reusable UI (Badge, ProgressRing, EmptyState)
  frontend/src/components/analysis/  - Fit score display
  frontend/src/components/generator/ - AI content generation
  backend-ts/src/services/claude/    - AI service layer
  backend-ts/src/services/ai/        - AI provider abstraction
```

### Common Commands
```bash
# Development
npm run dev              # Start dev server (both frontend & backend)
npm run typecheck        # Check TypeScript (backend only)
npm run build           # Build for production

# Verification
npm run typecheck       # Backend: Check types
npm run build          # Frontend: Verify build succeeds

# Testing
npm test               # Run tests (if configured)
```

---

**Last Updated:** March 24, 2026
**Maintained By:** Development team (with Claude Code assistance)
**Version:** Living document - update in real-time as you build
