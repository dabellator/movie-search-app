import { useState, useEffect } from 'react'
import { useQuery } from 'urql'
import { useSearchParams } from 'react-router-dom'
import { SEARCH_MOVIES, GET_GENRES } from '../graphql/queries'
import { useDebounce } from '../hooks/useDebounce'
import { useActivityStore } from '../store/userActivity'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'
import Pagination from '../components/Pagination'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const addSearchEvent = useActivityStore((state) => state.addSearchEvent)
  const addGenreFilterEvent = useActivityStore((state) => state.addGenreFilterEvent)
  
  // Initialize state from URL params
  const initialSearch = searchParams.get('search') || ''
  const initialGenre = searchParams.get('genre') || null
  const initialPage = parseInt(searchParams.get('page') || '1', 10)

  // State management
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(initialGenre)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [shouldFetchNow, setShouldFetchNow] = useState(false)
  const [hasTrackedCurrentSearch, setHasTrackedCurrentSearch] = useState(false)

  const perPage = 20

  // Debounce search query (500ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Use debounced query unless user hit Enter
  const activeSearchQuery = shouldFetchNow ? searchQuery : debouncedSearchQuery

  // Reset to page 1 when search params change
  useEffect(() => {
    setCurrentPage(1)
    setHasTrackedCurrentSearch(false) // Reset tracking flag
  }, [activeSearchQuery, selectedGenre])

  // Fetch genres (once)
  const [genresResult] = useQuery({
    query: GET_GENRES,
    variables: {
      pagination: { page: 1, perPage: 100 },
    },
  })

  // Fetch movies (reactive to state)
  const [moviesResult] = useQuery({
    query: SEARCH_MOVIES,
    variables: {
      pagination: { page: currentPage, perPage },
      where: {
        search: activeSearchQuery || undefined,
        genre: selectedGenre || undefined,
      },
    },
  })

  // Reset the immediate fetch flag after query executes
  useEffect(() => {
    if (shouldFetchNow && !moviesResult.fetching) {
      setShouldFetchNow(false)
    }
  }, [shouldFetchNow, moviesResult.fetching])

  const { data: moviesData, fetching: moviesFetching, error: moviesError } = moviesResult
  const { data: genresData, fetching: genresFetching } = genresResult

  const movies = moviesData?.movies?.nodes || []
  const pagination = moviesData?.movies?.pagination
  const genres = genresData?.genres?.nodes || []

  // Track successful searches and genre filters
  useEffect(() => {
    if (moviesData && !moviesFetching && !hasTrackedCurrentSearch) {
      const resultsCount = movies.length

      // Track search event if there's a query
      if (activeSearchQuery) {
        addSearchEvent({
          query: activeSearchQuery,
          genre: selectedGenre,
          resultsCount,
        })
      }

      // Track genre filter event if only genre is applied (no search)
      if (selectedGenre && !activeSearchQuery) {
        addGenreFilterEvent({
          genre: selectedGenre,
          resultsCount,
        })
      }

      setHasTrackedCurrentSearch(true)
    }
  }, [moviesData, moviesFetching, activeSearchQuery, selectedGenre, movies.length, hasTrackedCurrentSearch, addSearchEvent, addGenreFilterEvent])

  // Update URL params whenever filters change
  useEffect(() => {
    const params: Record<string, string> = {}
    if (activeSearchQuery) params.search = activeSearchQuery
    if (selectedGenre) params.genre = selectedGenre
    if (currentPage > 1) params.page = currentPage.toString()
    
    setSearchParams(params, { replace: true })
  }, [activeSearchQuery, selectedGenre, currentPage, setSearchParams])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setShouldFetchNow(false) // Reset immediate fetch flag
  }

  const handleSearchSubmit = () => {
    setShouldFetchNow(true) // Trigger immediate fetch
  }

  const handleGenreChange = (genreId: string | null) => {
    setSelectedGenre(genreId)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  if (moviesError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Movies</h2>
            <p className="text-red-300">{moviesError.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 text-blue-400">Discover Movies</h1>
          <p className="text-xl text-gray-400">
            Search thousands of movies and find your next favorite film
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          selectedGenre={selectedGenre}
          genres={genres}
          viewMode={viewMode}
          isLoading={moviesFetching || genresFetching}
          onSearchChange={handleSearchChange}
          onGenreChange={handleGenreChange}
          onSearchSubmit={handleSearchSubmit}
          onViewModeChange={handleViewModeChange}
        />

        {/* Movie Grid */}
        <MovieGrid
          movies={movies}
          viewMode={viewMode}
          isLoading={moviesFetching}
          totalResults={pagination?.totalPages ? pagination.totalPages * perPage : movies.length}
        />

        {/* Pagination */}
        {pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={moviesFetching}
          />
        )}
      </div>
    </div>
  )
}
