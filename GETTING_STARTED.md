# Getting Started with Cortex

Quick guide to get Cortex running on your machine.

## Prerequisites

- **Node.js 18+** and npm
- That's it! No Python, no complex setup.

## Installation (5 minutes)

### 1. Install Dependencies

```bash
# Backend
cd backend-ts
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Backend
cd backend-ts
cp .env.example .env

# Optional: Add your Google Gemini API key to .env
# Leave empty to use mock mode (recommended for development)
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend-ts
npm run dev
```

You should see:
```
⚠️  Using MOCK AI client (no API key configured)
✅ Database initialized
🚀 Cortex API running on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## Using the App

### Step 1: Upload Your Resume
- Click "Upload Resume" and select a PDF file
- Cortex will extract and parse the text

### Step 2: Add a Job Description
- Paste a job description from any job board
- Add company name, role, and stage (startup/growth/enterprise)

### Step 3: Analyze & Generate
- View fit score analysis (mock data in development mode)
- Generate tailored resume bullets
- Draft a cover letter
- Create interview prep materials
- Track in the pipeline

## Mock Mode vs Real API

### Mock Mode (Default - Free)
When `GEMINI_API_KEY=` (empty) in backend-ts/.env:
- ✅ Returns realistic dummy data
- ✅ Zero cost
- ✅ Perfect for development and demos
- ✅ Full functionality

### Real API Mode
To use real Gemini API:
1. Get a FREE API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update `backend-ts/.env`:
   ```
   GEMINI_API_KEY=your-actual-gemini-key
   ```
3. Restart backend
4. Console shows: `✅ Using REAL Gemini API client`

**Cost**: FREE! Gemini provides 60 requests/minute with their free tier.

## Troubleshooting

### Port 8000 already in use?
```bash
# Change port in backend-ts/.env
PORT=8001

# Update frontend API URL in frontend/.env (create if needed)
VITE_API_BASE_URL=http://localhost:8001
```

### Frontend can't connect to backend?
- Check backend is running on port 8000
- Check console for errors
- Verify CORS_ORIGINS in backend-ts/.env includes frontend URL

### Database errors?
```bash
# Delete database and restart
cd backend-ts
rm cortex.db
npm run dev
```

### TypeScript errors?
```bash
cd backend-ts
npm run typecheck
```

## Next Steps

- **Customize the UI**: Edit files in `frontend/src/components/`
- **Modify AI prompts**: Edit files in `backend-ts/src/services/claude/`
- **Add features**: The codebase is designed to be extensible
- **Deploy**: See deployment guides for Railway or Render

## Development Tips

- Backend auto-reloads on code changes (tsx watch)
- Frontend auto-reloads on code changes (Vite HMR)
- Use TypeScript for type safety
- Check browser console and terminal for errors
- Database schema auto-updates on model changes (TypeORM sync)

## Resources

- **Main README**: Project overview and architecture
- **CLAUDE.md**: Codebase guide for AI agents
- **backend-ts/README.md**: Backend-specific documentation
- **docs/PROJECT_STRUCTURE.md**: Detailed project structure guide

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review error messages in console/terminal
3. Check that both frontend and backend are running
4. Verify Node.js version: `node --version` (should be 18+)

Happy building! 🚀
