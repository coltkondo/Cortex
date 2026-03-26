import { claude, MODEL, MAX_TOKENS } from './client';
import { withCache } from '../cache';
import { refineWithStopSlop, refineJsonFields } from '../refining/stopSlopRefiner';

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

/**
 * ATS-like fit scoring using keyword extraction and skill matching
 * More deterministic and reliable than pure AI-based scoring
 */
async function analyzeFitInternal(
  resumeText: string,
  jobDescription: string,
  companyStage: string
): Promise<FitScoreResult> {
  try {
    // Validate input
    if (!resumeText || resumeText.trim().length === 0) {
      return {
        overall_match: 1,
        reasoning: 'Resume text is empty',
        skill_gaps: [],
        strengths: [],
        experience_alignment: 'Unable to determine',
        red_flags: ['Empty resume provided'],
      };
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      return {
        overall_match: 1,
        reasoning: 'Job description is empty',
        skill_gaps: [],
        strengths: [],
        experience_alignment: 'Unable to determine',
        red_flags: ['Empty job description provided'],
      };
    }

    // Extract keywords and skills
    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);

    const requiredSkills = extractSkills(jobDescription) || [];
    const candidateSkills = extractSkills(resumeText) || [];

    // Calculate skill match with improved matching logic
    let skillMatches: string[] = [];
    let skillMatchPercentage = 50;

    // Skill aliases and variations mapping
    const skillAliases: { [key: string]: string[] } = {
      'kubernetes': ['k8s', 'k3s'],
      'nodejs': ['node', 'node.js'],
      'nextjs': ['next', 'next.js'],
      'typescript': ['ts', 'typescri'],
      'javascript': ['js', 'vanilla js'],
      'docker': ['containerization', 'containers'],
      'ci/cd': ['continuous integration', 'continuous deployment', 'cicd'],
      'graphql': ['graph-ql', 'graphql'],
      'csharp': ['c#', 'c-sharp'],
      'cpp': ['c++'],
    };

    // Build reverse mapping
    const reverseAliases: { [key: string]: string } = {};
    Object.entries(skillAliases).forEach(([primary, aliases]) => {
      aliases.forEach((alias) => {
        reverseAliases[alias.toLowerCase()] = primary;
      });
    });

    // Normalize skills to their primary names
    const normalizeSkill = (skill: string): string => {
      const lower = skill.toLowerCase();
      return reverseAliases[lower] || lower;
    };

    const normalizedCandidateSkills = candidateSkills.map(normalizeSkill);
    const normalizedRequiredSkills = requiredSkills.map(normalizeSkill);

    if (requiredSkills.length > 0 && candidateSkills.length > 0) {
      // Match with both normalized names and fuzzy matching
      skillMatches = requiredSkills.filter((skill) => {
        const normalizedSkill = normalizeSkill(skill);
        
        // Check for exact match in normalized skills
        if (normalizedCandidateSkills.includes(normalizedSkill)) {
          return true;
        }
        
        // Fallback to fuzzy matching with lower threshold (0.6 instead of 0.7)
        return candidateSkills.some((cSkill) => {
          const normalizedCandidate = normalizeSkill(cSkill);
          const score = similarity(normalizedSkill, normalizedCandidate);
          return score > 0.6;
        });
      });
      skillMatchPercentage = Math.round((skillMatches.length / requiredSkills.length) * 100);
    } else if (requiredSkills.length > 0 && resumeKeywords.length > 0) {
      // Fallback: use keyword overlap
      skillMatches = requiredSkills.filter((skill) =>
        resumeKeywords.some((keyword) => 
          keyword.includes(skill.toLowerCase()) || skill.toLowerCase().includes(keyword)
        )
      );
      if (requiredSkills.length > 0) {
        skillMatchPercentage = Math.round((skillMatches.length / requiredSkills.length) * 100);
      }
    } else {
      // No skills found in either, default to middle ground
      skillMatchPercentage = 50;
    }

    // Estimate experience level
    const resumeExperience = estimateExperienceLevel(resumeText) || 'mid';
    const jobExperience = estimateExperienceLevel(jobDescription) || 'mid';

    // Calculate keyword match
    const keywordMatchPercentage = calculateKeywordMatch(jobKeywords, resumeKeywords) || 50;

    // Calculate component scores
    const experienceScore = getExperienceScoring(resumeExperience, jobExperience) || 50;
    const domainScore = calculateDomainFit(jobDescription, resumeText) || 50;

    // Find missing keywords using true ATS comparison
    const skillGaps = findMissingKeywords(jobDescription, resumeText);

    // Calculate overall match with weights
    let overallMatch = Math.round(
      (skillMatchPercentage || 50) * 0.4 +
        (keywordMatchPercentage || 50) * 0.3 +
        (experienceScore || 50) * 0.2 +
        (domainScore || 50) * 0.1
    );

    // Clamp to 1-99 range
    overallMatch = Math.max(1, Math.min(99, overallMatch));

    // Determine strengths
    const strengths = skillMatches.length > 0 ? skillMatches : ['No specific skills matched'];

    // Generate reasoning
    let reasoning = '';
    const skillPercentage = requiredSkills.length > 0 
      ? Math.round((skillMatches.length / requiredSkills.length) * 100)
      : 0;

    if (overallMatch >= 80) {
      reasoning = `Strong match with ${skillPercentage}% of required skills present. Experience level aligns well with role requirements.`;
    } else if (overallMatch >= 60) {
      reasoning = `Good match with ${skillMatches.length}/${requiredSkills.length || '?'} core skills. Most foundational requirements are present with some gaps in specialized areas.`;
    } else if (overallMatch >= 40) {
      reasoning = `Moderate match with some key skills present. Would require learning in specific technologies but has relevant foundational experience.`;
    } else {
      reasoning = `Limited match with few of the required skills currently present. Significant skill development would be needed for this role.`;
    }

    // Identify red flags
    const redFlags = identifyRedFlags(
      resumeText,
      jobDescription,
      skillGaps,
      resumeExperience,
      jobExperience
    );

    // Try to get AI enhancement (optional, with graceful fallback)
    const aiEnhancement = await getAIEnhancedDetails(
      resumeText,
      jobDescription,
      skillMatches,
      requiredSkills
    ).catch(() => null);

    // Return result with AI enhancement if available
    if (aiEnhancement) {
      const result = {
        overall_match: overallMatch,
        reasoning: aiEnhancement.reasoning || reasoning,
        skill_gaps: aiEnhancement.skill_gaps || skillGaps,
        strengths: aiEnhancement.strengths || strengths,
        experience_alignment:
          aiEnhancement.experience_alignment ||
          `${resumeExperience} - Aligns with ${jobExperience} level requirements`,
        red_flags: aiEnhancement.red_flags || redFlags,
      };
      return refineJsonFields(result, ['reasoning', 'experience_alignment']);
    }

    // Return with algorithm-generated details
    const result = {
      overall_match: overallMatch,
      reasoning,
      skill_gaps: skillGaps,
      strengths,
      experience_alignment: `${resumeExperience} - Aligns with ${jobExperience} level requirements`,
      red_flags: redFlags,
    };
    return refineJsonFields(result, ['reasoning', 'experience_alignment']);
  } catch (error) {
    console.error('Error in analyzeFit:', error);
    // Return a safe default
    return {
      overall_match: 50,
      reasoning: 'Analysis completed with partial results',
      skill_gaps: [],
      strengths: ['Resume and job description analyzed'],
      experience_alignment: 'Unable to determine',
      red_flags: error instanceof Error ? [error.message] : [],
    };
  }
}

/**
 * Extract important keywords from text (ATS-style)
 */
function extractKeywords(text: string): string[] {
  const keywords = new Set<string>();

  // Common tech keywords
  const techKeywords = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'c++', 'golang', 'rust',
    'react', 'vue', 'angular', 'svelte', 'nextjs', 'nodejs', 'express', 'django',
    'fastapi', 'flask', 'spring', 'rails', 'laravel', 'asp.net', 'dotnet',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform',
    'git', 'ci/cd', 'jenkins', 'github', 'gitlab', 'bitbucket',
    'rest', 'graphql', 'grpc', 'websocket', 'oauth', 'jwt',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material',
    'testing', 'jest', 'pytest', 'unittest', 'mocha', 'rspec',
    'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'machine learning', 'ai', 'nlp', 'opencv', 'tensorflow', 'pytorch',
    'api', 'microservices', 'monolith', 'serverless', 'lambda',
    'datawarehouse', 'bigquery', 'snowflake', 'redshift', 'spark',
  ];

  // Extract tech keywords
  const lowerText = text.toLowerCase();
  techKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      keywords.add(keyword);
    }
  });

  return Array.from(keywords);
}

/**
 * Extract skills and technologies - comprehensive list with variations
 */
function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const skills = new Set<string>();

  // Comprehensive technical skills with common variations
  const skillPatterns = [
    { skill: 'javascript', patterns: ['javascript', 'js', 'vanilla js', 'ecmascript', 'es6'] },
    { skill: 'typescript', patterns: ['typescript', 'ts', 'typescri'] },
    { skill: 'python', patterns: ['python', 'py3', 'python3'] },
    { skill: 'java', patterns: [/\bjava\b/, 'java '] }, // word boundary to avoid "javascript"
    { skill: 'golang', patterns: ['golang', 'go ', 'go programming'] },
    { skill: 'c++', patterns: ['c++', 'cpp', 'c plus'] },
    { skill: 'rust', patterns: ['rust', 'rust lang'] },
    { skill: 'csharp', patterns: ['csharp', 'c#', 'dotnet'] },
    { skill: 'react', patterns: ['react', 'reactjs', 'react.js'] },
    { skill: 'vue', patterns: ['vue', 'vuejs', 'vue.js'] },
    { skill: 'angular', patterns: ['angular', 'angularjs'] },
    { skill: 'svelte', patterns: ['svelte'] },
    { skill: 'nextjs', patterns: ['nextjs', 'next.js', 'next js'] },
    { skill: 'nodejs', patterns: ['nodejs', 'node.js', 'node js'] },
    { skill: 'express', patterns: ['express', 'expressjs'] },
    { skill: 'django', patterns: ['django'] },
    { skill: 'fastapi', patterns: ['fastapi'] },
    { skill: 'flask', patterns: ['flask'] },
    { skill: 'spring', patterns: ['spring', 'spring boot'] },
    { skill: 'rails', patterns: ['rails', 'ruby on rails'] },
    { skill: 'laravel', patterns: ['laravel'] },
    { skill: 'sql', patterns: ['sql', 't-sql', 'tsql'] },
    { skill: 'mongodb', patterns: ['mongodb', 'mongo'] },
    { skill: 'postgresql', patterns: ['postgresql', 'postgres', 'pg '] },
    { skill: 'mysql', patterns: ['mysql'] },
    { skill: 'redis', patterns: ['redis'] },
    { skill: 'elasticsearch', patterns: ['elasticsearch'] },
    { skill: 'docker', patterns: ['docker', 'containerization'] },
    { skill: 'kubernetes', patterns: ['kubernetes', 'k8s', 'k3s'] },
    { skill: 'aws', patterns: ['aws', 'amazon web services'] },
    { skill: 'gcp', patterns: ['gcp', 'google cloud'] },
    { skill: 'azure', patterns: ['azure', 'microsoft azure'] },
    { skill: 'terraform', patterns: ['terraform'] },
    { skill: 'git', patterns: ['git', 'github', 'gitlab', 'bitbucket', 'gitflow'] },
    { skill: 'ci/cd', patterns: ['ci/cd', 'ci-cd', 'continuous integration', 'continuous deployment'] },
    { skill: 'jenkins', patterns: ['jenkins'] },
    { skill: 'rest', patterns: ['rest api', 'restful', 'rest'] },
    { skill: 'graphql', patterns: ['graphql', 'graph ql'] },
    { skill: 'grpc', patterns: ['grpc'] },
    { skill: 'websocket', patterns: ['websocket', 'ws '] },
    { skill: 'oauth', patterns: ['oauth', 'oauth2'] },
    { skill: 'jwt', patterns: ['jwt', 'json web token'] },
    { skill: 'html', patterns: ['html', 'html5'] },
    { skill: 'css', patterns: ['css', 'css3'] },
    { skill: 'sass', patterns: ['sass', 'scss'] },
    { skill: 'tailwind', patterns: ['tailwind', 'tailwind css'] },
    { skill: 'bootstrap', patterns: ['bootstrap'] },
    { skill: 'testing', patterns: ['testing', 'unit testing', 'test driven', 'tdd'] },
    { skill: 'jest', patterns: ['jest'] },
    { skill: 'pytest', patterns: ['pytest'] },
    { skill: 'unittest', patterns: ['unittest'] },
    { skill: 'mocha', patterns: ['mocha'] },
    { skill: 'rspec', patterns: ['rspec'] },
    { skill: 'agile', patterns: ['agile', 'agile methodology'] },
    { skill: 'scrum', patterns: ['scrum', 'scrummaster'] },
    { skill: 'kanban', patterns: ['kanban'] },
    { skill: 'jira', patterns: ['jira'] },
    { skill: 'microservices', patterns: ['microservices', 'microservice architecture'] },
    { skill: 'serverless', patterns: ['serverless', 'lambda'] },
    { skill: 'machine learning', patterns: ['machine learning', 'ml ', 'ml '] },
    { skill: 'ai', patterns: ['artificial intelligence', ' ai ', ' ai,', 'ai.'] },
    { skill: 'tensorflow', patterns: ['tensorflow'] },
    { skill: 'pytorch', patterns: ['pytorch'] },
    { skill: 'api', patterns: ['api ', ' api,', ' api.', 'apis'] },
  ];

  // Check each pattern
  skillPatterns.forEach(({ skill, patterns }) => {
    patterns.forEach((pattern) => {
      if (typeof pattern === 'string') {
        if (lowerText.includes(pattern)) {
          skills.add(skill);
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(lowerText)) {
          skills.add(skill);
        }
      }
    });
  });

  // Extract experience years
  const yearsMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/gi);
  if (yearsMatch) {
    skills.add('experienced');
  }

  return Array.from(skills);
}

/**
 * Calculate similarity between two strings (Levenshtein-like)
 */
function similarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance for string similarity
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculate keyword match percentage
 */
function calculateKeywordMatch(jobKeywords: string[], resumeKeywords: string[]): number {
  if (jobKeywords.length === 0) return 50;

  const matches = jobKeywords.filter((keyword) =>
    resumeKeywords.some((resKeyword) => 
      resKeyword.includes(keyword) || keyword.includes(resKeyword)
    )
  );

  return Math.round((matches.length / jobKeywords.length) * 100);
}

/**
 * Estimate experience level from text
 */
function estimateExperienceLevel(text: string): string {
  const lowerText = text.toLowerCase();

  // Look for explicit level mentions
  if (lowerText.includes('principal') || lowerText.includes('architect')) {
    return 'senior (architect)';
  }
  if (lowerText.includes('senior')) {
    return 'senior';
  }
  if (lowerText.includes('lead') || lowerText.includes('head of')) {
    return 'senior';
  }
  if (lowerText.includes('staff')) {
    return 'senior';
  }

  // Look for years of experience
  const yearsMatch = lowerText.match(/(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/);
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1]);
    if (years >= 10) return 'senior';
    if (years >= 5) return 'mid';
    if (years >= 2) return 'mid';
    if (years >= 0) return 'junior';
  }

  // Look for mid-level indicators
  if (lowerText.includes('mid-level') || lowerText.includes('mid level')) {
    return 'mid';
  }
  if (lowerText.includes('junior') || lowerText.includes('entry')) {
    return 'junior';
  }

  // Default guess based on content length/detail
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 2000) return 'senior';
  if (wordCount > 1000) return 'mid';
  return 'junior';
}

/**
 * Score experience level alignment
 */
function getExperienceScoring(resumeLevel: string, jobLevel: string): number {
  const levelMap = { junior: 1, mid: 2, senior: 3 };

  const resumeValue = levelMap[resumeLevel.split(' ')[0] as keyof typeof levelMap] || 2;
  const jobValue = levelMap[jobLevel.split(' ')[0] as keyof typeof levelMap] || 2;

  // Exact match is perfect
  if (resumeValue === jobValue) return 100;

  // One level difference is good (85%)
  if (Math.abs(resumeValue - jobValue) === 1) return 85;

  // Two levels difference is moderate (50%)
  if (Math.abs(resumeValue - jobValue) === 2) return 50;

  return 30;
}

/**
 * Calculate domain/industry fit
 */
function calculateDomainFit(jobDescription: string, resumeText: string): number {
  const lowerJob = jobDescription.toLowerCase();
  const lowerResume = resumeText.toLowerCase();

  const domains = [
    'fintech', 'finance', 'banking',
    'healthtech', 'healthcare', 'medical',
    'ecommerce', 'retail', 'marketplace',
    'saas', 'enterprise', 'b2b', 'b2c',
    'startup', 'scale-up', 'unicorn',
    'government', 'defense', 'security',
    'education', 'learning',
    'gaming', 'entertainment',
  ];

  let matches = 0;
  domains.forEach((domain) => {
    if (lowerJob.includes(domain) && lowerResume.includes(domain)) {
      matches++;
    }
  });

  if (matches > 0) return 85;

  // Check for general professional alignment
  if (lowerResume.includes('professional') ||
      lowerResume.includes('experience') ||
      lowerResume.includes('project')) {
    return 70;
  }

  return 50;
}

/**
 * Find keywords/requirements in job description that are missing from resume (ATS-style)
 */
function findMissingKeywords(jobDescription: string, resumeText: string): string[] {
  const lowerJob = jobDescription.toLowerCase();
  const lowerResume = resumeText.toLowerCase();
  const missingKeywords: Set<string> = new Set();

  // Extract meaningful phrases and single keywords from job description
  // Look for patterns like "React Developer", "AWS Lambda", etc.
  const phrases = [
    // Extract multi-word technical terms
    ...extractTechPhrases(jobDescription),
    // Extract individual technical terms
    ...extractIndividualTechs(jobDescription),
  ];

  // Filter to only those NOT in resume
  phrases.forEach((phrase) => {
    const lowerPhrase = phrase.toLowerCase();
    // Check if phrase exists in resume with some flexibility for variations
    const isPresentInResume = 
      lowerResume.includes(lowerPhrase) ||
      lowerResume.includes(lowerPhrase.replace(/\s+/g, '')) ||
      lowerResume.includes(lowerPhrase.replace(/-/g, '')) ||
      // Check for fuzzy match
      findSimilarPhrase(lowerPhrase, lowerResume);

    if (!isPresentInResume && lowerPhrase.length > 0) {
      missingKeywords.add(phrase);
    }
  });

  // Convert to array, prioritize longer phrases, and return top 5
  return Array.from(missingKeywords)
    .sort((a, b) => b.length - a.length)
    .slice(0, 5);
}

/**
 * Extract multi-word technical phrases from text
 */
function extractTechPhrases(text: string): string[] {
  const phrases: Set<string> = new Set();
  
  // Patterns for common technical phrases
  const phrasePatterns = [
    /(?:strong\s+)?(?:experience\s+)?(?:with\s+)?(\w[\w\s,&\-]+(?:development|engineering|programming|management|automation|deployment|integration|testing))/gi,
    /(?:knowledge\s+of|familiarity\s+with|experience\s+with)\s+([^.,:;]+?)(?:\.|,|;|$)/gi,
    /(?:proficiency\s+in)\s+([^.,:;]+?)(?:\.|,|;|$)/gi,
    /must\s+(?:have|know)\s+([^.,:;]+?)(?:\.|,|;|$)/gi,
    /required\s+(?:skill|technology|tool)s?:?\s*([^.,:;]+?)(?:\.|,|;|$)/gi,
  ];

  phrasePatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        // Clean up the captured phrase
        let phrase = match[1]
          .replace(/\s+and\s+/gi, ', ')
          .trim()
          .split(',')[0]
          .trim();
        
        if (phrase.length > 3 && phrase.length < 100) {
          phrases.add(phrase);
        }
      }
    }
  });

  return Array.from(phrases);
}

/**
 * Extract individual technology/skill keywords from text
 */
function extractIndividualTechs(text: string): string[] {
  const techs: Set<string> = new Set();

  // Comprehensive technology keywords
  const techList = [
    // Languages
    'javascript', 'typescript', 'python', 'java', 'golang', 'rust', 'csharp', 'cpp', 'ruby', 'php', 'swift', 'kotlin',
    // Frameworks & Libraries
    'react', 'vue', 'angular', 'nextjs', 'svelte', 'remix', 'nuxt', 'ember',
    'express', 'nestjs', 'fastify', 'hapi', 'koa',
    'django', 'fastapi', 'flask', 'pyramid',
    'spring', 'spring boot', 'spring cloud',
    'rails', 'sinatra',
    'laravel', 'symfony',
    // Databases
    'postgresql', 'mysql', 'mongodb', 'redis', 'dynamodb', 'cassandra', 'elasticsearch', 'firebase', 'supabase',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'heroku', 'vercel', 'netlify', 'railway',
    'docker', 'kubernetes', 'docker compose', 'helm',
    'terraform', 'cloudformation', 'ansible',
    // CI/CD & Tools
    'github actions', 'gitlab ci', 'jenkins', 'circleci', 'travis ci', 'github', 'gitlab', 'bitbucket',
    'git', 'npm', 'yarn', 'pnpm', 'pip', 'maven', 'gradle',
    // Testing
    'jest', 'vitest', 'mocha', 'chai', 'testing library',
    'pytest', 'unittest',
    'rspec',
    // APIs & Architecture
    'rest api', 'restful', 'graphql', 'grpc', 'websocket',
    'microservices', 'serverless', 'lambda', 'iac',
    // DevOps & Infrastructure
    'linux', 'unix', 'windows server', 'nginx', 'apache', 'load balancer',
    'vpc', 'ec2', 's3', 'rds', 'lambda', 'sns', 'sqs',
    // Front-end specific
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material ui', 'styled components',
    'webpack', 'vite', 'parcel', 'rollup',
    'babel',
    // Soft skills
    'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'communication', 'leadership', 'mentoring', 'code review',
    // Data & Analytics
    'sql', 'hadoop', 'spark', 'kafka', 'airflow',
    'tableau', 'looker', 'power bi',
    'data warehouse', 'bigquery', 'snowflake', 'redshift',
    // AI/ML specific
    'machine learning', 'deep learning', 'nlp', 'cv', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
    // Security
    'oauth', 'jwt', 'ssl', 'encryption', 'authentication',
  ];

  const lowerText = text.toLowerCase();
  
  techList.forEach((tech) => {
    // Use word boundary matching for single words, flexible for multi-word
    if (tech.includes(' ')) {
      if (lowerText.includes(tech)) {
        techs.add(tech);
      }
    } else {
      // Single word - use word boundaries
      const regex = new RegExp(`\\b${tech}\\b`, 'i');
      if (regex.test(lowerText)) {
        techs.add(tech);
      }
    }
  });

  return Array.from(techs);
}

/**
 * Find if a phrase has a similar variant in the text (handles aliases)
 */
function findSimilarPhrase(phrase: string, text: string): boolean {
  // Alias mappings for common variations
  const aliases: { [key: string]: string[] } = {
    'kubernetes': ['k8s', 'k3s'],
    'nodejs': ['node.js', 'node'],
    'nextjs': ['next.js', 'next'],
    'react': ['reactjs', 'react.js'],
    'vue': ['vuejs', 'vue.js'],
    'typescript': ['ts'],
    'javascript': ['js'],
    'graphql': ['graph-ql'],
    'docker': ['containerization', 'containers'],
    'ci/cd': ['continuous integration', 'continuous deployment'],
    'machine learning': ['ml'],
    'artificial intelligence': ['ai'],
  };

  // Check if phrase has any known aliases in text
  for (const [canonical, variants] of Object.entries(aliases)) {
    if (phrase.includes(canonical) || variants.some(v => phrase.includes(v))) {
      for (const variant of variants) {
        if (text.includes(variant)) return true;
      }
      if (text.includes(canonical)) return true;
    }
  }

  return false;
}

/**
 * Identify red flags in the fit
 */
function identifyRedFlags(
  resumeText: string,
  jobDescription: string,
  skillGaps: string[],
  resumeExperience: string,
  jobExperience: string
): string[] {
  const redFlags: string[] = [];
  const lowerResume = resumeText.toLowerCase();
  const lowerJob = jobDescription.toLowerCase();

  // Check for overqualification
  const resumeLevel = resumeExperience.split(' ')[0];
  const jobLevel = jobExperience.split(' ')[0];
  const levelMap = { junior: 1, mid: 2, senior: 3 };
  const resumeValue = levelMap[resumeLevel as keyof typeof levelMap] || 2;
  const jobValue = levelMap[jobLevel as keyof typeof levelMap] || 2;

  if (resumeValue > jobValue + 1) {
    redFlags.push('Candidate may be overqualified for this role');
  }

  // Check for underqualification
  if (jobValue > resumeValue + 1) {
    redFlags.push('Experience level below typical requirements');
  }

  // Check for major skill gaps
  if (skillGaps.length > 3) {
    redFlags.push(`Multiple significant skill gaps: ${skillGaps.slice(0, 3).join(', ')}`);
  }

  // Check for conflicting requirements
  if ((lowerJob.includes('startup') && lowerResume.includes('enterprise only')) ||
      (lowerJob.includes('enterprise') && lowerResume.includes('startup only'))) {
    redFlags.push('Environment preference mismatch');
  }

  // Check for geographic/relocation concerns (if mentioned)
  if (lowerJob.includes('remote') && lowerResume.includes('on-site only')) {
    redFlags.push('Work arrangement mismatch');
  }

  return redFlags.length > 0 ? redFlags : [];
}

/**
 * Get AI enhancement for analysis (optional, with graceful fallback)
 */
async function getAIEnhancedDetails(
  resumeText: string,
  jobDescription: string,
  matchedSkills: string[],
  requiredSkills: string[]
): Promise<Partial<FitScoreResult> | null> {
  try {
    const failureSkills = requiredSkills.filter(
      (skill) => !matchedSkills.some((m) => m.toLowerCase() === skill.toLowerCase())
    );

    const prompt = `Analyze this resume-job match briefly.

RESUME EXCERPT:
${resumeText.substring(0, 1500)}

JOB EXCERPT:
${jobDescription.substring(0, 1500)}

Matched skills: ${matchedSkills.join(', ')}
Missing skills: ${failureSkills.slice(0, 5).join(', ')}

Respond with ONLY valid JSON (no markdown):
{
  "reasoning": "1-2 sentences about the fit",
  "strengths": ["skill1", "skill2"],
  "skill_gaps": ["gap1", "gap2"],
  "experience_alignment": "level - brief explanation",
  "red_flags": ["flag1"] or []
}`;

    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // Lower temperature for consistency
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    // Silently fail - the fallback logic will handle it
  }

  return null;
}
