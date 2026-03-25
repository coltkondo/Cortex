import { ai, MODEL, MAX_TOKENS } from './client';

export interface ResumeAnalysis {
  overallScore: number; // 0-100
  atsScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  keywordSuggestions: string[];
  bulletImprovements: {
    original: string;
    improved: string;
    reason: string;
  }[];
  skillsGap: {
    missing: string[];
    trending: string[];
  };
}

export async function analyzeResume(resumeContent: string): Promise<ResumeAnalysis> {
  const prompt = `You are an expert resume analyst and career coach. Analyze the following resume and provide comprehensive, actionable feedback.

RESUME CONTENT:
${resumeContent}

Provide your analysis in the following JSON format:

{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "strengths": [<array of 3-5 key strengths>],
  "weaknesses": [<array of 3-5 areas to improve>],
  "keywordSuggestions": [<array of 5-10 ATS-friendly keywords to add>],
  "bulletImprovements": [
    {
      "original": "<original bullet point from resume>",
      "improved": "<improved version using STAR/CAR method>",
      "reason": "<brief explanation of why this is better>"
    }
    // Include 3-5 bullet improvements
  ],
  "skillsGap": {
    "missing": [<array of 3-5 in-demand skills not mentioned>],
    "trending": [<array of 3-5 emerging skills relevant to their field>]
  }
}

ANALYSIS CRITERIA:

1. **Overall Score (0-100)**:
   - Content quality and relevance
   - Structure and formatting
   - Achievement focus
   - Keyword optimization

2. **ATS Score (0-100)**:
   - Keyword density
   - Standard section headers
   - Format compatibility
   - Industry-specific terminology

3. **Strengths**: Identify what's working well (quantified achievements, strong action verbs, clear progression, etc.)

4. **Weaknesses**: Identify areas needing improvement (vague descriptions, passive voice, gaps, etc.)

5. **Keyword Suggestions**: Industry-standard terms, technical skills, certifications that would improve ATS pass-through

6. **Bullet Improvements**: Take actual bullets from the resume and rewrite them using:
   - Action verbs (Led, Designed, Achieved, etc.)
   - Quantifiable results (%, $, time saved, etc.)
   - STAR method (Situation, Task, Action, Result)
   - Clear impact and scope

7. **Skills Gap**: Based on the resume's industry/role, identify:
   - **Missing**: High-demand skills not currently mentioned
   - **Trending**: Emerging technologies/methodologies they should learn

Be specific, actionable, and focused on helping the candidate stand out. Use professional language and provide concrete examples.`;

  try {
    const response = await ai.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].text;

    // Extract JSON from response
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}') + 1;
    const jsonStr = content.substring(startIdx, endIdx);
    const analysis: ResumeAnalysis = JSON.parse(jsonStr);

    // Validate scores are within range
    analysis.overallScore = Math.max(0, Math.min(100, analysis.overallScore));
    analysis.atsScore = Math.max(0, Math.min(100, analysis.atsScore));

    return analysis;
  } catch (error: any) {
    console.error('Resume analysis error:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}
