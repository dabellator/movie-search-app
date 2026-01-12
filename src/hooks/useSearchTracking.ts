import { useEffect, useRef } from 'react'
import { useActivityStore } from '../store/userActivity'

interface SearchTrackingParams {
  query: string
  genre: string | null
  resultsCount: number
  isFetching: boolean
  hasData: boolean
}

// Hook to automatically track search and genre filter events
// Tracks when search results are successfully loaded
export function useSearchTracking({
  query,
  genre,
  resultsCount,
  isFetching,
  hasData
}: SearchTrackingParams) {
  const addSearchEvent = useActivityStore((state) => state.addSearchEvent)
  const addGenreFilterEvent = useActivityStore((state) => state.addGenreFilterEvent)
  
  // Track what we've already logged to avoid duplicates
  const trackedRef = useRef<{ query: string; genre: string | null }>({ query: '', genre: null })

  useEffect(() => {
    // Only track when data is loaded and not currently fetching
    if (hasData && !isFetching) {
      const currentKey = `${query}|${genre || ''}`
      const trackedKey = `${trackedRef.current.query}|${trackedRef.current.genre || ''}`
      
      // Only track if query/genre combination has changed
      if (currentKey !== trackedKey) {
        // Track search event if there's a query
        if (query) {
          addSearchEvent({
            query,
            genre,
            resultsCount,
          })
        }
        
        // Track genre filter event if only genre is applied (no search)
        if (genre && !query) {
          addGenreFilterEvent({
            genre,
            resultsCount,
          })
        }
        
        // Update tracked reference
        trackedRef.current = { query, genre }
      }
    }
  }, [query, genre, resultsCount, isFetching, hasData, addSearchEvent, addGenreFilterEvent])
}
