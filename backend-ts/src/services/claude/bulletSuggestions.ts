import { claude, MODEL, MAX_TOKENS } from './client';
import { withCache } from '../cache';
import { refineWithStopSlop } from '../refining/stopSlopRefiner';

export async function generateBullets(
  resumeText: string,
  jobDescription: string
): Promise<string[]> {
  // Use caching to avoid duplicate AI calls
  return withCache(
    'bullets',
    async () => generateBulletsInternal(resumeText, jobDescription),
    resumeText,
    jobDescription
  );
}

async function generateBulletsInternal(
  resumeText: string,
  jobDescription: string
): Promise<string[]> {
  const prompt = `Based on this resume and job description, suggest 5-7 tailored resume bullet points using the STAR method.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

STAR Method Requirements:
- Situation/Task: Briefly set up the problem or context (what was the challenge, need, or goal?)
- Action: Describe the specific actions you took to address it
- Result: Include quantified metrics (%, time saved, $ impact, scale achieved)

Guidelines:
1. Each bullet MUST follow STAR structure
2. Use strong action verbs (Built, Engineered, Designed, Optimized, Automated, Deployed, etc.)
3. Lead with the action verb
4. Include concrete metrics (percentages, time, money, scale)
5. Mirror key technical terms from the job description
6. Focus on the most relevant 2-3 experiences
7. Each bullet should be 1-2 lines max

Example STAR bullets:
- "Identified bottleneck in API response time; optimized database queries and caching layer, reducing latency by 40%"
- "Discovered compliance gaps in payment processing; implemented validation system with encryption, eliminating audit failures"

Return your response as a JSON array of strings:
["bullet 1", "bullet 2", ...]`;

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0].text;

  try {
    const startIdx = content.indexOf('[');
    const endIdx = content.lastIndexOf(']') + 1;
    const jsonStr = content.substring(startIdx, endIdx);
    const bullets = JSON.parse(jsonStr);
    // Apply stop-slop refinement to remove AI tells
    return bullets.map((bullet: string) => refineWithStopSlop(bullet));
  } catch (error) {
    // Fallback: split by newlines
    const lines = content.split('\n').filter((line) => line.trim().length > 20);
    const bullets = lines
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .slice(0, 7);
    // Apply stop-slop refinement to remove AI tells
    return bullets.map((bullet) => refineWithStopSlop(bullet));
  }
}
