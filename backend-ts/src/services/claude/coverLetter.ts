import { claude, MODEL, MAX_TOKENS } from './client';

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  company: string,
  role: string,
  tone: string = 'professional'
): Promise<string> {
  const toneGuidance: Record<string, string> = {
    professional:
      'Use a formal, professional tone suitable for traditional corporate environments.',
    conversational:
      'Use a warm, conversational tone while remaining professional. Show personality.',
  };

  const prompt = `Write a compelling cover letter for this job application.

COMPANY: ${company}
ROLE: ${role}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

TONE: ${toneGuidance[tone] || toneGuidance.professional}

Guidelines:
1. Keep it to 3-4 paragraphs (under 400 words)
2. Opening: Hook that shows you understand the role/company
3. Body: 2-3 most relevant experiences/achievements that directly connect to the JD
4. Closing: Clear call to action
5. Ground everything in actual resume content - don't make things up
6. Focus on "why you" not "why me"

Write the complete cover letter (no placeholders like [Your Name] - use actual resume content):`;

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim();
}
