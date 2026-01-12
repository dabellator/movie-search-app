import { useMemo } from 'react'
import { useQuery } from 'urql'
import { SEARCH_MOVIES } from '../graphql/queries'
import type { Pagination, MovieFilterInput } from '../types/movie'

interface UseTotalResultsParams {
  pagination: Pagination | undefined
  currentMoviesCount: number
  perPage: number
  searchQuery: string
  selectedGenre: string | null
}

// Custom hook to calculate total results across all pages
// Fetches the last page when needed to get an accurate count
export function useTotalResults({
  pagination,
  currentMoviesCount,
  perPage,
  searchQuery,
  selectedGenre,
}: UseTotalResultsParams): number {
  // Fetch last page to calculate exact total (only when totalPages > 1)
  const [lastPageResult] = useQuery({
    query: SEARCH_MOVIES,
    variables: {
      pagination: { page: pagination?.totalPages || 1, perPage },
      where: {
        search: searchQuery || undefined,
        genre: selectedGenre || undefined,
      } as MovieFilterInput,
    },
    pause: !pagination || pagination.totalPages <= 1,
  })

  // Calculate total results from last page
  const totalResults = useMemo(() => {
    if (!pagination) return currentMoviesCount

    // Single page - just use current movies count
    if (pagination.totalPages === 1) {
      return currentMoviesCount
    }

    // Multiple pages - calculate from last page if available
    if (lastPageResult.data?.movies?.nodes) {
      const lastPageCount = lastPageResult.data.movies.nodes.length
      const total = (pagination.totalPages - 1) * perPage + lastPageCount
      return total
    }

    // While waiting for last page data, show estimate
    return pagination.totalPages * perPage
  }, [pagination, lastPageResult.data, currentMoviesCount, perPage])

  return totalResults
}
