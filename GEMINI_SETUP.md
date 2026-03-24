# Setting Up Google Gemini API

Follow these steps to get your FREE Gemini API key and enable real AI features in Cortex.

## Step 1: Get Your Free API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key (starts with something like `AIza...`)

## Step 2: Configure Your Environment

1. Open `backend-ts/.env` in your text editor
2. Update the `GEMINI_API_KEY` line:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```
3. Save the file

## Step 3: Restart the Backend

```bash
cd backend-ts
npm run dev
```

You should now see:
```
✅ Using REAL Gemini API client
✅ Database initialized
🚀 Cortex API running on http://localhost:8000
```

## Step 4: Test It Out!

1. Upload a resume (if you haven't already)
2. Add a job description
3. Click "Analyze Fit" - you should now see real AI-generated analysis!

## Free Tier Limits

- **60 requests per minute** (more than enough for personal use)
- **No credit card required**
- **Unlimited usage** within rate limits

## Troubleshooting

### Still seeing mock data?
- Check that the API key is correctly copied (no extra spaces)
- Restart the backend server
- Check the terminal for error messages

### API errors?
- Verify your API key is active at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Check your network connection
- Ensure you're not hitting rate limits (60 req/min)

### Want to switch back to mock mode?
Simply clear the API key in `.env`:
```
GEMINI_API_KEY=
```

## What Model Are We Using?

Cortex uses **Gemini 2.5 Flash** (`gemini-2.5-flash`):
- Latest fast and efficient model
- Excellent for text analysis and understanding
- Free tier included (60 requests/minute)
- Great for structured outputs (JSON)

## Cost Comparison

| Provider | Free Tier | Cost After Free Tier |
|----------|-----------|---------------------|
| **Gemini** | 60 req/min (unlimited) | $0 |
| Claude | None | ~$0.006 per analysis |
| OpenAI GPT-4 | $5 credit | ~$0.03 per analysis |

Gemini is perfect for this use case!

---

**Need help?** Check the [GETTING_STARTED.md](GETTING_STARTED.md) guide or open an issue.
