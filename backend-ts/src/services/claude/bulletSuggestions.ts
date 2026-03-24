import { claude, MODEL, MAX_TOKENS } from './client';
import { withCache } from '../cache';

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
  const prompt = `Based on this resume and job description, suggest 5-7 tailored resume bullet points that highlight the candidate's most relevant experience for this specific role.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Guidelines:
1. Use strong action verbs
2. Include metrics and impact where possible
3. Mirror key terms from the job description
4. Focus on the most relevant 2-3 experiences
5. Each bullet should be 1-2 lines max

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
    return JSON.parse(jsonStr);
  } catch (error) {
    // Fallback: split by newlines
    const lines = content.split('\n').filter((line) => line.trim().length > 20);
    const bullets = lines
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .slice(0, 7);
    return bullets;
  }
}
