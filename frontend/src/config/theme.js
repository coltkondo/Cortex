/**
 * Theme Configuration
 * Centralized color values and design tokens for consistent UI
 */

// Primary Color Palette (Tailwind uses these via tailwind.config.js)
// These hex values match the primary colors used throughout the app
export const COLORS = {
  // Primary Brand Colors
  PRIMARY: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Semantic Colors
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    600: '#16a34a',
    800: '#166534',
  },

  WARNING: {
    50: '#fefce8',
    100: '#fef9c3',
    600: '#ca8a04',
    800: '#854d0e',
  },

  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    600: '#dc2626',
    800: '#991b1b',
  },

  INFO: {
    50: '#eff6ff',
    100: '#dbeafe',
    600: '#2563eb',
    800: '#1e40af',
  },

  // Grayscale
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Custom Scrollbar Colors
  SCROLLBAR: {
    TRACK: '#f1f1f1',
    THUMB: '#c1c1c1',
    THUMB_HOVER: '#a1a1a1',
  },

  // Focus Ring Color
  FOCUS_RING: '#4f46e5',
}

// Color Mappings for Components
export const PROGRESS_RING_COLORS = {
  primary: 'text-primary-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
}

export const PROGRESS_RING_STROKES = {
  primary: 'stroke-primary-600',
  green: 'stroke-green-600',
  yellow: 'stroke-yellow-600',
  red: 'stroke-red-600',
}

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
}

// Transition Classes
export const TRANSITIONS = {
  DEFAULT: 'transition-all duration-300 ease-in-out',
  FAST: 'transition-all duration-150 ease-in-out',
  SLOW: 'transition-all duration-500 ease-in-out',
  COLORS: 'transition-colors duration-300',
  TRANSFORM: 'transition-transform duration-300',
}

// Border Radius
export const BORDER_RADIUS = {
  SM: '0.375rem', // 6px
  DEFAULT: '0.5rem', // 8px
  LG: '0.75rem', // 12px
  FULL: '9999px',
}

// Shadow Presets
export const SHADOWS = {
  SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}

// Spacing Scale (in pixels)
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
}
