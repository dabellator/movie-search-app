export interface SearchEvent {
  type: 'search'
  id: string
  query: string
  genre: string | null
  timestamp: number
  resultsCount?: number
}

export interface MovieViewEvent {
  type: 'movie_view'
  id: string
  movieId: string
  movieTitle: string
  genres: string[]
  timestamp: number
  fromSearch?: string // query that led to this view
  fromGenre?: string // genre filter that led to this view
}

export interface GenreFilterEvent {
  type: 'genre_filter'
  id: string
  genre: string
  timestamp: number
  resultsCount?: number
}

export type ActivityEvent = SearchEvent | MovieViewEvent | GenreFilterEvent

export interface UserPreferences {
  topGenres: Record<string, number> // genre -> count
  searchPatterns: string[] // recent unique searches
  viewedMovies: string[] // movie IDs
  lastActive: number
}

export interface AIPromptData {
  recentSearches: string[]
  topGenres: Array<{ genre: string; count: number }>
  recentlyViewed: Array<{ title: string; genres: string[] }>
  totalEvents: number
  activeSince: number
  activitySummary: string
}
