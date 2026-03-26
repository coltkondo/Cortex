import { ai, MODEL, MAX_TOKENS } from './client';
import { refineJsonFields } from '../refining/stopSlopRefiner';

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

6. **Bullet Improvements**: Take actual bullets from the resume and rewrite them using the STAR method (Situation, Task, Action, Result):
   - **Situation/Task**: Briefly describe the problem, challenge, or context (what was needed?)
   - **Action**: Specific actions you took (built, designed, optimized, automated, etc.)
   - **Result**: Quantifiable impact (%, time saved, $, scale, users impacted, etc.)
   - CRITICAL: Every improved bullet MUST include a concrete metric (percentage, dollars, time, or scale)
   - Use strong action verbs (Engineered, Architected, Optimized, Automated, Deployed, etc.)
   - Lead with the action verb when possible
   - Keep to 1-2 lines max

Example transformations:
- Weak: "Responsible for testing software"
- Strong: "Designed and automated test suite for 10+ modules reducing defect escape rate by 20%"

- Weak: "Worked on database optimization"
- Strong: "Diagnosed database bottleneck; implemented indexing and query optimization reducing query time by 40% and supporting 50K concurrent users"

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

    // Extract JSON from response with better error handling
    try {
      const startIdx = content.indexOf('{');
      const endIdx = content.lastIndexOf('}') + 1;

      if (startIdx === -1 || endIdx === 0) {
        throw new Error('No JSON object found in response');
      }

      const jsonStr = content.substring(startIdx, endIdx);
      const analysis: ResumeAnalysis = JSON.parse(jsonStr);

      // Validate and sanitize the response
      analysis.overallScore = Math.max(0, Math.min(100, Number(analysis.overallScore) || 50));
      analysis.atsScore = Math.max(0, Math.min(100, Number(analysis.atsScore) || 50));
      analysis.strengths = Array.isArray(analysis.strengths) ? analysis.strengths.slice(0, 5) : [];
      analysis.weaknesses = Array.isArray(analysis.weaknesses) ? analysis.weaknesses.slice(0, 5) : [];
      analysis.keywordSuggestions = Array.isArray(analysis.keywordSuggestions) ? analysis.keywordSuggestions.slice(0, 10) : [];
      analysis.bulletImprovements = Array.isArray(analysis.bulletImprovements) ? analysis.bulletImprovements.slice(0, 5) : [];

      if (!analysis.skillsGap) {
        analysis.skillsGap = { missing: [], trending: [] };
      }

      analysis.skillsGap.missing = Array.isArray(analysis.skillsGap.missing) ? analysis.skillsGap.missing.slice(0, 5) : [];
      analysis.skillsGap.trending = Array.isArray(analysis.skillsGap.trending) ? analysis.skillsGap.trending.slice(0, 5) : [];

      // Apply stop-slop refinement to remove AI tells
      return refineJsonFields(analysis, [
        'strengths',
        'weaknesses',
        'keywordSuggestions',
        'bulletImprovements',
        'original',
        'improved',
        'reason',
        'missing',
        'trending',
      ]);
    } catch (parseError: any) {
      console.error('JSON parsing error:', parseError.message);
      console.error('Response content:', content.substring(0, 500));

      // Return a fallback analysis
      return {
        overallScore: 65,
        atsScore: 70,
        strengths: [
          'Resume uploaded successfully',
          'Content is being processed',
          'Ready for detailed analysis'
        ],
        weaknesses: [
          'AI analysis encountered a formatting issue',
          'Please try regenerating the analysis'
        ],
        keywordSuggestions: [
          'Leadership',
          'Project Management',
          'Communication',
          'Team Collaboration',
          'Problem Solving'
        ],
        bulletImprovements: [
          {
            original: 'Managed projects',
            improved: 'Led cross-functional teams to deliver 5 projects on time, resulting in 20% efficiency improvement',
            reason: 'Added quantifiable metrics and specific outcomes'
          }
        ],
        skillsGap: {
          missing: ['Technical Writing', 'Data Analysis', 'Public Speaking'],
          trending: ['AI/ML Basics', 'Cloud Computing', 'Agile Methodologies']
        }
      };
    }
  } catch (error: any) {
    console.error('Resume analysis error:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}
