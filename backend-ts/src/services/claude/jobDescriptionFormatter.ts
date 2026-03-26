import { claude, MODEL, MAX_TOKENS } from './client';
import { withCache } from '../cache';

export interface FormattedJobDescription {
  title: string;
  company: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  compensation?: string;
  format: string;
}

/**
 * Clean and format raw job description into structured sections
 */
export async function formatJobDescription(
  rawDescription: string,
  company?: string,
  role?: string
): Promise<FormattedJobDescription> {
  return withCache(
    'job-format',
    async () => formatJobDescriptionInternal(rawDescription, company, role),
    rawDescription,
    company || '',
    role || ''
  );
}

async function formatJobDescriptionInternal(
  rawDescription: string,
  company?: string,
  role?: string
): Promise<FormattedJobDescription> {
  const prompt = `You are an expert job description parser. Clean and structure this raw job posting into clear, organized sections.

RAW JOB DESCRIPTION:
${rawDescription}

${company ? `Company: ${company}` : ''}
${role ? `Role Title: ${role}` : ''}

Extract and format into this JSON structure:
{
  "title": "Exact job title from posting",
  "company": "Company name",
  "overview": "2-3 sentence summary of the role and impact",
  "responsibilities": ["responsibility 1", "responsibility 2", ...],
  "requirements": ["required skill/qualification 1", "required skill 2", ...],
  "niceToHave": ["nice to have 1", "nice to have 2", ...],
  "compensation": "salary range or compensation details if included, null if not mentioned",
  "format": "Clean, structured description ready for resume analysis"
}

REQUIREMENTS:
- Remove all noise (navigation, headers, page content, apply buttons, company boilerplate)
- Extract ONLY job-relevant information
- Consolidate duplicate descriptions
- Format as clear bullet points
- Responsibility bullets should start with action verbs
- Requirement bullets should be specific (e.g., "3+ years of React experience" not "React")
- Include only responsibilities/requirements actually mentioned in the JD
- Return valid JSON only`;

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

    return {
      title: parsed.title || role || 'Unknown Role',
      company: parsed.company || company || 'Unknown Company',
      overview: parsed.overview || '',
      responsibilities: Array.isArray(parsed.responsibilities)
        ? parsed.responsibilities.filter((r: string) => r && r.trim())
        : [],
      requirements: Array.isArray(parsed.requirements)
        ? parsed.requirements.filter((r: string) => r && r.trim())
        : [],
      niceToHave: Array.isArray(parsed.niceToHave)
        ? parsed.niceToHave.filter((n: string) => n && n.trim())
        : undefined,
      compensation: parsed.compensation || undefined,
      format: generateFormattedDisplay(
        parsed.title || role || '',
        parsed.company || company || '',
        parsed.overview || '',
        parsed.responsibilities || [],
        parsed.requirements || [],
        parsed.niceToHave,
        parsed.compensation
      ),
    };
  } catch (error) {
    console.error('Error parsing job description:', error);
    throw new Error('Failed to parse job description. Please check the format and try again.');
  }
}

/**
 * Generate human-readable formatted display
 */
function generateFormattedDisplay(
  title: string,
  company: string,
  overview: string,
  responsibilities: string[],
  requirements: string[],
  niceToHave?: string[],
  compensation?: string
): string {
  let display = '';

  if (title) display += `# ${title}\n`;
  if (company) display += `**${company}**\n\n`;
  if (compensation) display += `💰 ${compensation}\n\n`;

  if (overview) display += `## Overview\n${overview}\n\n`;

  if (responsibilities.length > 0) {
    display += `## Responsibilities\n`;
    responsibilities.forEach((r) => {
      display += `• ${r}\n`;
    });
    display += '\n';
  }

  if (requirements.length > 0) {
    display += `## Required\n`;
    requirements.forEach((r) => {
      display += `• ${r}\n`;
    });
    display += '\n';
  }

  if (niceToHave && niceToHave.length > 0) {
    display += `## Nice to Have\n`;
    niceToHave.forEach((n) => {
      display += `• ${n}\n`;
    });
  }

  return display.trim();
}
