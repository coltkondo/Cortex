import { claude, MODEL, MAX_TOKENS } from './client';
import { withCache } from '../cache';

export interface FitScoreResult {
  overall_match: number;
  reasoning: string;
  skill_gaps: string[];
  strengths: string[];
  experience_alignment: string;
  red_flags?: string[];
}

export async function analyzeFit(
  resumeText: string,
  jobDescription: string,
  companyStage: string
): Promise<FitScoreResult> {
  // Use caching to avoid duplicate AI calls
  return withCache(
    'fit-score',
    async () => analyzeFitInternal(resumeText, jobDescription, companyStage),
    resumeText,
    jobDescription,
    companyStage
  );
}

async function analyzeFitInternal(
  resumeText: string,
  jobDescription: string,
  companyStage: string
): Promise<FitScoreResult> {
  const prompt = `Analyze the fit between this resume and job description. Provide a structured assessment.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

COMPANY STAGE: ${companyStage}

Provide your analysis in the following JSON format:
{
    "overall_match": <integer 0-100>,
    "reasoning": "<2-3 sentence explanation of the match score>",
    "skill_gaps": ["<skill 1>", "<skill 2>", ...],
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "experience_alignment": "<junior/mid/senior> - <explanation>",
    "red_flags": ["<flag 1>", "<flag 2>", ...] or []
}

Focus on:
1. Technical skills match
2. Experience level alignment
3. Domain/industry fit
4. Company stage alignment (startup vs enterprise fit)
5. Potential concerns or stretches`;

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0].text;

  try {
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}') + 1;
    const jsonStr = content.substring(startIdx, endIdx);
    return JSON.parse(jsonStr);
  } catch (error) {
    // Fallback
    return {
      overall_match: 50,
      reasoning: 'Failed to parse AI response',
      skill_gaps: [],
      strengths: [],
      experience_alignment: 'Unable to determine',
      red_flags: ['Error parsing AI response'],
    };
  }
}
