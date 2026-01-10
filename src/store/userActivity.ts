import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  ActivityEvent,
  UserPreferences,
  SearchEvent,
  MovieViewEvent,
  GenreFilterEvent,
  AIPromptData,
} from './types'

interface UserActivityStore {
  events: ActivityEvent[]
  preferences: UserPreferences
  maxEvents: number
  maxAge: number // milliseconds

  // Actions
  addSearchEvent: (data: Omit<SearchEvent, 'type' | 'id' | 'timestamp'>) => void
  addMovieViewEvent: (data: Omit<MovieViewEvent, 'type' | 'id' | 'timestamp'>) => void
  addGenreFilterEvent: (data: Omit<GenreFilterEvent, 'type' | 'id' | 'timestamp'>) => void
  
  // Utilities
  getActivityForAI: () => AIPromptData
  clearAllData: () => void
  pruneOldEvents: () => void
  
  // Internal
  _updatePreferences: () => void
}

const createInitialPreferences = (): UserPreferences => ({
  topGenres: {},
  searchPatterns: [],
  viewedMovies: [],
  lastActive: Date.now(),
})

export const useActivityStore = create<UserActivityStore>()(
  persist(
    (set, get) => ({
      events: [],
      preferences: createInitialPreferences(),
      maxEvents: 100,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds

      addSearchEvent: (data) => {
        const event: SearchEvent = {
          type: 'search',
          id: `search-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          ...data,
        }

        set((state) => {
          const newEvents = [...state.events, event].slice(-state.maxEvents)
          return { events: newEvents }
        })

        get()._updatePreferences()
      },

      addMovieViewEvent: (data) => {
        const event: MovieViewEvent = {
          type: 'movie_view',
          id: `view-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          ...data,
        }

        set((state) => {
          const newEvents = [...state.events, event].slice(-state.maxEvents)
          return { events: newEvents }
        })

        get()._updatePreferences()
      },

      addGenreFilterEvent: (data) => {
        const event: GenreFilterEvent = {
          type: 'genre_filter',
          id: `genre-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          ...data,
        }

        set((state) => {
          const newEvents = [...state.events, event].slice(-state.maxEvents)
          return { events: newEvents }
        })

        get()._updatePreferences()
      },

      pruneOldEvents: () => {
        const now = Date.now()
        const maxAge = get().maxAge

        set((state) => ({
          events: state.events.filter((event) => now - event.timestamp < maxAge),
        }))
      },

      _updatePreferences: () => {
        const state = get()
        const events = state.events

        // Calculate top genres from all events
        const genreCounts: Record<string, number> = {}
        
        events.forEach((event) => {
          if (event.type === 'genre_filter') {
            genreCounts[event.genre] = (genreCounts[event.genre] || 0) + 1
          } else if (event.type === 'movie_view') {
            event.genres.forEach((genre) => {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1
            })
          }
        })

        // Extract unique search patterns (last 20)
        const searches = events
          .filter((e): e is SearchEvent => e.type === 'search')
          .map((e) => e.query)
          .filter((q) => q.trim() !== '')
          .reverse()
          .filter((value, index, self) => self.indexOf(value) === index)
          .slice(0, 20)

        // Extract viewed movies
        const viewedMovies = Array.from(
          new Set(
            events
              .filter((e): e is MovieViewEvent => e.type === 'movie_view')
              .map((e) => e.movieId)
          )
        )

        set({
          preferences: {
            topGenres: genreCounts,
            searchPatterns: searches,
            viewedMovies,
            lastActive: Date.now(),
          },
        })
      },

      getActivityForAI: (): AIPromptData => {
        const state = get()
        const { events, preferences } = state

        // Get recent searches (last 10)
        const recentSearches = events
          .filter((e): e is SearchEvent => e.type === 'search')
          .slice(-10)
          .map((e) => e.query)
          .filter((q) => q.trim() !== '')

        // Get top genres sorted by count
        const topGenres = Object.entries(preferences.topGenres)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)

        // Get recently viewed movies (last 10)
        const recentlyViewed = events
          .filter((e): e is MovieViewEvent => e.type === 'movie_view')
          .slice(-10)
          .map((e) => ({
            title: e.movieTitle,
            genres: e.genres,
          }))

        // Calculate how long user has been active
        const firstEventTime = events[0]?.timestamp || Date.now()
        const daysSinceFirst = Math.floor((Date.now() - firstEventTime) / (1000 * 60 * 60 * 24))

        // Create activity summary
        const searchCount = events.filter((e) => e.type === 'search').length
        const viewCount = events.filter((e) => e.type === 'movie_view').length
        const genreFilterCount = events.filter((e) => e.type === 'genre_filter').length

        const activitySummary = `User has performed ${searchCount} searches, viewed ${viewCount} movies, and filtered by genre ${genreFilterCount} times over ${daysSinceFirst} days. Top genres: ${topGenres.slice(0, 3).map(g => g.genre).join(', ')}. Recent searches: ${recentSearches.slice(-5).join(', ')}.`

        return {
          recentSearches,
          topGenres,
          recentlyViewed,
          totalEvents: events.length,
          activeSince: firstEventTime,
          activitySummary,
        }
      },

      clearAllData: () => {
        set({
          events: [],
          preferences: createInitialPreferences(),
        })
      },
    }),
    {
      name: 'movie-user-activity',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        events: state.events,
        preferences: state.preferences,
      }),
    }
  )
)

// Auto-prune on load
useActivityStore.getState().pruneOldEvents()
