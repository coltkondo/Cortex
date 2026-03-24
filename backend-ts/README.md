# Cortex Backend - TypeScript/Node.js

This is the TypeScript/Node.js backend for Cortex, replacing the Python/FastAPI version.

## Why TypeScript?

- ✅ Uses npm (same as frontend, no Python version issues)
- ✅ Type safety with TypeScript
- ✅ Works on restricted networks
- ✅ Same REST API structure as Python version
- ✅ Mock Claude service included

## Quick Start

```bash
# Install dependencies
cd backend-ts
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

The server will start on `http://localhost:8000` with mock Claude client enabled by default.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## Tech Stack

- **Express** - Web framework
- **TypeORM** - Database ORM (similar to SQLAlchemy)
- **SQLite** - Database (production can use PostgreSQL)
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **@anthropic-ai/sdk** - Claude API client
- **TypeScript** - Type safety

## API Endpoints

Same as Python version:

- `POST /api/resume/upload` - Upload resume PDF
- `GET /api/resume` - Get current resume
- `DELETE /api/resume` - Delete resume
- `POST /api/jobs` - Create job
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get specific job
- `PATCH /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/analysis/fit-score/:jobId` - Analyze fit
- `POST /api/analysis/bullets/:jobId` - Generate bullets
- `POST /api/analysis/cover-letter/:jobId` - Generate cover letter
- `POST /api/analysis/interview-prep/:jobId` - Generate interview prep

## Environment Variables

See `.env.example` for all configuration options.

**Mock Mode (default):**
```env
ANTHROPIC_API_KEY=your_api_key_here
```

**Real API:**
```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key
```

## Mock Mode

The backend automatically uses mock mode when:
- No API key is set
- API key is `your_api_key_here`
- `USE_MOCK_CLAUDE=true`

Console will show: `⚠️  Using MOCK Claude client (no API key configured)`

## Database

Uses TypeORM with SQLite (development) or PostgreSQL (production).

Models:
- `Resume` - Parsed resume data
- `Job` - Job descriptions
- `Application` - Application tracking
- `GeneratedContent` - AI-generated content cache

## Frontend Compatibility

This backend is a drop-in replacement for the Python version. The React frontend works with zero changes!

## Differences from Python Version

| Feature | Python | TypeScript | Notes |
|---------|--------|------------|-------|
| Framework | FastAPI | Express | Both REST APIs |
| ORM | SQLAlchemy | TypeORM | Similar syntax |
| PDF Parsing | PyMuPDF | pdf-parse | Same functionality |
| Type Safety | Pydantic | Zod + TypeScript | Similar validation |
| Dev Server | uvicorn | tsx watch | Hot reload in both |

## Troubleshooting

**Port 8000 already in use?**
```bash
# Change port in .env
PORT=8001
```

**Database errors?**
```bash
# Delete and recreate
rm cortex.db
npm run dev
```

**TypeScript errors?**
```bash
npm run typecheck
```

## Migrating from Python

If you were using the Python backend:

1. Stop the Python server
2. `cd backend-ts`
3. `npm install`
4. `cp .env.example .env`
5. `npm run dev`

The database schema is the same, so your data is compatible!
