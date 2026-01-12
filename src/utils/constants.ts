// Application-wide constants

// API Endpoints
export const API_ENDPOINTS = {
  MOVIES_API: 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com',
  OPENAI_API: 'https://api.openai.com/v1/chat/completions',
} as const

// Pagination
export const PAGINATION = {
  MOVIES_PER_PAGE: 20,
  GENRES_PER_PAGE: 100,
  STATUS_TEST_MOVIES: 5,
  STATUS_TEST_GENRES: 20,
} as const

// OpenAI Configuration
export const OPENAI = {
  MODEL: 'gpt-4o-mini',
  TEST_MAX_TOKENS: 5,
} as const
