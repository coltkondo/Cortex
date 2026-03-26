/**
 * Mock AI client for local development without API key.
 * Returns realistic dummy data for testing the frontend.
 */

import { AIClient, AIResponse } from '../ai/types';

export class MockAIClient implements AIClient {
  messages = {
    create: async (params: any): Promise<AIResponse> => {
      const userContent = params.messages?.[0]?.content?.toLowerCase() || '';

      if (userContent.includes('fit') || userContent.includes('analyze')) {
        return this.mockFitScore();
      } else if (userContent.includes('bullet')) {
        return this.mockBullets();
      } else if (userContent.includes('cover letter')) {
        return this.mockCoverLetter();
      } else if (userContent.includes('interview') || userContent.includes('prep')) {
        return this.mockInterviewPrep();
      }

      return { content: [{ text: 'Mock response' }] };
    },
  };

  private mockFitScore(): AIResponse {
    // Return realistic mock data that matches the new ATS-like scoring
    const scores = [65, 72, 78, 82, 88];
    const score = scores[Math.floor(Math.random() * scores.length)];

    const response = JSON.stringify({
      overall_match: score,
      reasoning:
        score >= 80
          ? `Strong match with majority of required skills. Experience level aligns well with role requirements and domain expertise is relevant.`
          : score >= 70
            ? `Good match with most core skills present. Some skill gaps but foundational experience is relevant to the role.`
            : `Moderate match with key skills present. Would require some role-specific learning but has relevant experience.`,
      skill_gaps:
        score >= 80
          ? ['Advanced AWS architecture', 'Kubernetes orchestration']
          : score >= 70
            ? ['GraphQL', 'Kubernetes', 'Advanced AWS']
            : ['GraphQL', 'Kubernetes', 'AWS Lambda', 'Docker advanced patterns'],
      strengths:
        score >= 80
          ? [
              'Python/FastAPI',
              'React',
              'SQL databases',
              'REST API design',
              'CI/CD pipelines',
              'Full-stack development',
            ]
          : score >= 70
            ? ['Python/FastAPI', 'React', 'SQL databases', 'REST API design', 'CI/CD pipelines']
            : ['Python', 'React', 'SQL databases', 'Basic API design'],
      experience_alignment:
        score >= 80
          ? 'mid to senior - Excellent alignment with role expectations'
          : score >= 70
            ? 'mid - Good alignment with core requirements'
            : 'junior to mid - Some growth opportunity to meet all requirements',
      red_flags:
        score >= 80
          ? []
          : score >= 70
            ? ['Limited cloud infrastructure experience']
            : ['Limited production deployment experience', 'Few years with current tech stack'],
    });

    return { content: [{ text: response }] };
  }

  private mockBullets(): AIResponse {
    const response = JSON.stringify([
      'Architected and deployed a full-stack job application tracking system using React and FastAPI, reducing manual application management time by 60%',
      'Integrated Claude AI API to automate resume analysis and cover letter generation, processing 100+ job descriptions with 85% accuracy',
      'Designed and implemented RESTful APIs with FastAPI, supporting 10+ endpoints with comprehensive error handling and validation',
      'Built responsive frontend components using React and Tailwind CSS, ensuring mobile-first design and accessibility compliance',
      'Developed PDF parsing pipeline using PyMuPDF to extract and structure resume data for AI analysis',
      'Implemented Zustand state management for efficient client-side data handling across multiple application views',
      'Created SQLAlchemy database models and migrations for scalable data persistence of applications and generated content',
    ]);

    return { content: [{ text: response }] };
  }

  private mockCoverLetter(): AIResponse {
    const response = `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at your company. With over five years of experience building full-stack applications and a proven track record of delivering scalable solutions, I am excited about the opportunity to contribute to your team.

In my previous role, I architected and deployed several production applications using React and Python, similar to the tech stack mentioned in your job description. One project I'm particularly proud of is a career management platform that leverages AI to automate time-consuming tasks, reducing manual work by 60% while improving accuracy. This experience has given me deep expertise in API integration, database design, and creating intuitive user interfaces.

Your company's focus on innovation and solving real-world problems resonates strongly with my own approach to software development. I'm particularly drawn to the challenges mentioned in the job description around scalability and performance optimization, areas where I have hands-on experience and a track record of success.

I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.

Best regards,
[Your Name]`;

    return { content: [{ text: response }] };
  }

  private mockInterviewPrep(): AIResponse {
    const response = JSON.stringify({
      behavioral_questions: [
        'Tell me about a time you had to make a technical decision with incomplete information',
        'Describe a situation where you had to work with a difficult team member',
        'How do you prioritize competing demands on your time?',
        'Tell me about a project that failed and what you learned from it',
        'Describe your experience working with cross-functional teams',
      ],
      star_answers: [
        'SITUATION: During the Cortex project, our team needed to choose an AI provider. TASK: Evaluate options quickly to avoid delaying the timeline. ACTION: I researched Claude, OpenAI, and local models, comparing costs and capabilities. RESULT: Selected Claude API, which reduced implementation time by 40% and met all requirements.',
        'SITUATION: Building the resume parser, PDF extraction had inconsistent results. TASK: Improve parsing accuracy without rewriting the entire module. ACTION: I analyzed failure cases, added text cleaning logic, and implemented validation. RESULT: Parsing accuracy improved from 60% to 95%.',
        'SITUATION: Frontend and backend development were blocking each other. TASK: Enable parallel development. ACTION: I defined clear API contracts first and created mock endpoints. RESULT: Both teams worked simultaneously, completing the MVP 2 weeks ahead of schedule.',
      ],
      technical_topics: [
        'REST API design best practices',
        'React hooks and component lifecycle',
        'SQL query optimization and indexing',
        'Authentication and authorization patterns',
        'Error handling and logging strategies',
        'Testing strategies (unit, integration, E2E)',
        'Database migrations and schema design',
        'API rate limiting and caching',
      ],
      questions_to_ask: [
        'What does the day-to-day collaboration look like between frontend and backend engineers?',
        'How does the team approach technical debt and when do you prioritize it?',
        "What's the deployment process and how often do you ship to production?",
        'Can you describe a recent technical challenge the team faced and how you solved it?',
        'What are the biggest technical priorities for the team in the next 6 months?',
      ],
      company_context:
        'This appears to be a growth-stage company focused on building scalable products. They likely value practical engineering skills, ability to ship quickly, and collaboration across teams.',
    });

    return { content: [{ text: response }] };
  }
}

export const mockAIClient = new MockAIClient();
