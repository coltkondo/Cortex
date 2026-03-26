import { claude, MODEL, MAX_TOKENS } from './client';
import { withCache } from '../cache';
import { refineWithStopSlop, refineJsonFields } from '../refining/stopSlopRefiner';

export interface InterviewPrepResult {
  behavioral_questions: string[];
  star_answers: string[];
  technical_topics: string[];
  questions_to_ask: string[];
  company_context?: string;
}

export async function generateInterviewPrep(
  resumeText: string,
  jobDescription: string,
  company: string,
  role: string
): Promise<InterviewPrepResult> {
  // Use caching to avoid duplicate AI calls
  return withCache(
    'interview-prep',
    async () => generateInterviewPrepInternal(resumeText, jobDescription, company, role),
    resumeText,
    jobDescription,
    company,
    role
  );
}

async function generateInterviewPrepInternal(
  resumeText: string,
  jobDescription: string,
  company: string,
  role: string
): Promise<InterviewPrepResult> {
  const prompt = `Create a comprehensive interview prep sheet for this job application.

COMPANY: ${company}
ROLE: ${role}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Provide your prep sheet in the following JSON format:
{
    "behavioral_questions": ["question 1", "question 2", ...],
    "star_answers": ["STAR answer using actual resume bullet 1", "STAR answer 2", ...],
    "technical_topics": ["topic 1 to review", "topic 2", ...],
    "questions_to_ask": ["thoughtful question 1", "question 2", ...],
    "company_context": "2-3 sentence summary of what to know about the company/stage"
}

Guidelines:
1. Behavioral questions: 5-7 most likely questions based on the JD
2. STAR answers: 3-4 pre-written STAR answers using ACTUAL resume content
3. Technical topics: 5-8 specific concepts/technologies to brush up on
4. Questions to ask: 4-6 thoughtful, role-specific questions for the interviewer
5. Company context: Brief, relevant context about the company/stage`;

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
    const parsed = JSON.parse(jsonStr);
    // Apply stop-slop refinement to remove AI tells
    return refineJsonFields(parsed, [
      'behavioral_questions',
      'star_answers',
      'technical_topics',
      'questions_to_ask',
      'company_context',
    ]);
  } catch (error) {
    // Fallback
    return {
      behavioral_questions: ['Tell me about a time you faced a challenge'],
      star_answers: ['Unable to generate STAR answers'],
      technical_topics: ['Review job description for technical requirements'],
      questions_to_ask: ['What does success look like in this role?'],
      company_context: 'Review company website and recent news',
    };
  }
}
