/**
 * Application Constants
 * Central location for all hardcoded values to improve maintainability and scalability
 */

// API Configuration
export const API_CONFIG = {
  DEFAULT_BASE_URL: 'http://localhost:8000',
  REQUEST_TIMEOUT: 30000, // 30 seconds
}

// UI Timing Constants
export const TIMING = {
  SUCCESS_MESSAGE_DURATION: 3000, // 3 seconds
  COPY_FEEDBACK_DURATION: 2000, // 2 seconds
  ANIMATION_DURATION: 1000, // 1 second
  DEBOUNCE_DELAY: 300, // 300ms
}

// Form Validation
export const VALIDATION = {
  MIN_DESCRIPTION_LENGTH: 50,
  MIN_JOB_CONTENT_LENGTH: 100,
}

// Fit Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  MODERATE: 40,
  // Below 40 is considered poor
}

// Score Level Configurations
export const SCORE_LEVELS = {
  excellent: {
    color: 'green',
    label: 'Excellent Match',
    badge: 'success',
    minScore: 80,
  },
  good: {
    color: 'primary',
    label: 'Good Match',
    badge: 'primary',
    minScore: 60,
  },
  moderate: {
    color: 'yellow',
    label: 'Moderate Match',
    badge: 'warning',
    minScore: 40,
  },
  poor: {
    color: 'red',
    label: 'Poor Match',
    badge: 'error',
    minScore: 0,
  },
}

// UI Size Constants
export const SIZES = {
  PROGRESS_RING_DEFAULT: 120,
  PROGRESS_RING_LARGE: 160,
  PROGRESS_RING_STROKE_DEFAULT: 8,
  PROGRESS_RING_STROKE_LARGE: 12,
  ICON_SMALL: 3,
  ICON_MEDIUM: 4,
  ICON_LARGE: 5,
  ICON_XLARGE: 6,
}

// Badge Variants (Tailwind classes)
export const BADGE_VARIANTS = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  primary: 'bg-primary-100 text-primary-800',
}

// Badge Sizes
export const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

// User-facing Messages
export const MESSAGES = {
  // Errors
  ERROR_INVALID_URL: 'Please enter a valid URL',
  ERROR_MISSING_FIELDS: 'Please fill in all required fields',
  ERROR_CREATE_JOB_FAILED: 'Failed to create job',
  ERROR_FETCH_URL_FAILED: 'Failed to fetch job description from URL',
  ERROR_LOAD_FIT_SCORE: 'Failed to load fit score',

  // Success
  SUCCESS_URL_FETCHED: 'Job description fetched successfully! Review and edit below.',

  // Loading
  LOADING_ANALYZING: 'Analyzing job fit with AI...',
  LOADING_FETCHING: 'Fetching...',

  // Instructions
  INSTRUCTION_PASTE_URL: 'Paste a link to a job posting and we\'ll extract the description for you',
  INSTRUCTION_COMPLETE_FIELDS: 'Fill in company, role, and description (min 50 chars) to continue',
  INSTRUCTION_INCLUDE_DETAILS: 'Include requirements, responsibilities, and any relevant details',
}

// External Links
export const EXTERNAL_LINKS = {
  GITHUB_REPO: 'https://github.com',
  PLACEHOLDER_JOB_URL: 'https://example.com/jobs/senior-engineer',
}

// Application Steps
export const APP_STEPS = {
  UPLOAD_RESUME: {
    number: 1,
    title: 'Upload Your Resume',
    description: 'Upload your PDF resume to begin analysis',
  },
  ADD_JOB: {
    number: 2,
    title: 'Add a Job Description',
    description: 'Paste or fetch a job posting to analyze fit',
  },
  GET_INSIGHTS: {
    number: 3,
    title: 'Get AI-Powered Insights',
    description: 'Receive tailored analysis and suggestions',
  },
}

// Company Stage Options
export const COMPANY_STAGES = {
  STARTUP: { value: 'startup', label: 'Startup (Seed/Series A)' },
  SERIES_B: { value: 'series_b', label: 'Series B-D' },
  LATE_STAGE: { value: 'late_stage', label: 'Late Stage' },
  PUBLIC: { value: 'public', label: 'Public Company' },
}
