/**
 * Backend Application Constants
 * Centralized configuration for timeouts, limits, and magic numbers
 */

// HTTP Request Configuration
export const HTTP_CONFIG = {
  // Timeout for external URL fetching (15 seconds)
  URL_FETCH_TIMEOUT: 15000,

  // Maximum number of redirects to follow
  MAX_REDIRECTS: 5,

  // User agent for web scraping
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
}

// Content Validation
export const CONTENT_VALIDATION = {
  // Minimum length for extracted job description (100 chars)
  MIN_JOB_DESCRIPTION_LENGTH: 100,

  // Minimum length for substantial content during extraction (200 chars)
  MIN_SUBSTANTIAL_CONTENT_LENGTH: 200,

  // Minimum resume file size (in bytes)
  MIN_RESUME_SIZE: 100,

  // Maximum resume file size (5MB in bytes)
  MAX_RESUME_SIZE: 5 * 1024 * 1024,
}

// Database Configuration
export const DB_CONFIG = {
  // Default database path (development)
  DEFAULT_DB_PATH: './cortex.db',

  // Connection pool settings
  MAX_QUERY_EXECUTION_TIME: 30000, // 30 seconds
}

// Server Configuration
export const SERVER_CONFIG = {
  // Default port if not specified in environment
  DEFAULT_PORT: 8000,

  // Default CORS origin for development
  DEFAULT_CORS_ORIGIN: 'http://localhost:5173',

  // API rate limiting (requests per minute)
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
}

// AI Service Configuration
export const AI_CONFIG = {
  // Gemini model to use
  MODEL_NAME: 'gemini-2.5-flash',

  // Request timeout for AI API calls (30 seconds)
  AI_REQUEST_TIMEOUT: 30000,

  // Max tokens for AI responses
  MAX_OUTPUT_TOKENS: 2048,

  // Temperature for AI responses
  TEMPERATURE: 0.7,
}

// URL Scraping Selectors
export const SCRAPING_SELECTORS = {
  // Common selectors for job descriptions
  JOB_DESCRIPTION: [
    '#job-description',
    '.job-description',
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    '[id*="job-description"]',
    '[id*="jobDescription"]',
    'article',
    'main',
    '[role="main"]',
  ],

  // Meta tags to extract company info
  COMPANY_META: [
    'meta[property="og:site_name"]',
    'meta[name="author"]',
  ],

  // Selectors for job title
  TITLE_SELECTORS: [
    'meta[property="og:title"]',
    'h1',
    'title',
  ],
}

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL format. Please provide a valid URL.',
  URL_NOT_FOUND: 'Could not reach the URL. Please check the URL and your internet connection.',
  URL_TIMEOUT: 'Request timed out. The website took too long to respond.',
  INSUFFICIENT_CONTENT: 'Could not extract sufficient job description content from URL',
  FETCH_FAILED: 'Failed to fetch job description',
  NO_RESUME: 'No resume found. Please upload a resume first.',
  INVALID_JOB_ID: 'Invalid job ID provided',
  DATABASE_ERROR: 'Database operation failed',
}

// File Upload Configuration
export const UPLOAD_CONFIG = {
  // Allowed file types
  ALLOWED_MIME_TYPES: ['application/pdf'],

  // Allowed file extensions
  ALLOWED_EXTENSIONS: ['.pdf'],
}

// Response Status Codes
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}
