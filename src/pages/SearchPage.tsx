import { useState, useEffect } from 'react'
import { useQuery } from 'urql'
import { useSearchParams, Link } from 'react-router-dom'
import { SEARCH_MOVIES, GET_GENRES } from '../graphql/queries'
import { useDebounce } from '../hooks/useDebounce'
import { useAIRecommendations } from '../hooks/useAIRecommendations'
import { useSearchTracking } from '../hooks/useSearchTracking'
import { useTotalResults } from '../hooks/useTotalResults'
import { PAGINATION } from '../utils/constants'
import Layout from '../components/Layout'
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'
import Pagination from '../components/Pagination'
import RecommendationsError from '../components/RecommendationsError'
import ErrorDisplay from '../components/ErrorDisplay'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { recommendations, fetchRecommendations, clearRecommendations } = useAIRecommendations()
  
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

  // Sync state with URL params when they change (e.g., from Link navigation)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    const urlGenre = searchParams.get('genre') || null
    const urlPage = parseInt(searchParams.get('page') || '1', 10)

    setSearchQuery(urlSearch)
    setSelectedGenre(urlGenre)
    setCurrentPage(urlPage)
  }, [searchParams])

  const perPage = PAGINATION.MOVIES_PER_PAGE

  // Debounce search query (500ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 1000)

  // Use debounced query unless user hits Enter
  const activeSearchQuery = shouldFetchNow ? searchQuery : debouncedSearchQuery

  // Reset to page 1 when search params change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeSearchQuery, selectedGenre])

  // Fetch genres (once)
  const [genresResult] = useQuery({
    query: GET_GENRES,
    variables: {
      pagination: { page: 1, perPage: PAGINATION.GENRES_PER_PAGE },
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

  // Calculate total results across all pages
  const totalResults = useTotalResults({
    pagination,
    currentMoviesCount: movies.length,
    perPage,
    searchQuery: activeSearchQuery,
    selectedGenre,
  })

  // Track successful searches and genre filters
  useSearchTracking({
    query: activeSearchQuery,
    genre: selectedGenre,
    resultsCount: movies.length,
    isFetching: moviesFetching,
    hasData: !!moviesData
  })

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setShouldFetchNow(false) // Reset immediate fetch flag
    if (recommendations.isActive) {
      clearRecommendations() // Clear recommendations when user starts new search
    }
    // Update URL
    const params: Record<string, string> = {}
    if (query) params.search = query
    if (selectedGenre) params.genre = selectedGenre
    setSearchParams(params, { replace: true })
  }

  const handleSearchSubmit = () => {
    setShouldFetchNow(true) // Trigger immediate fetch
    if (recommendations.isActive) {
      clearRecommendations()
    }
  }

  const handleGenreChange = (genreId: string | null) => {
    setSelectedGenre(genreId)
    if (recommendations.isActive) {
      clearRecommendations()
    }
    // Update URL
    const params: Record<string, string> = {}
    if (searchQuery) params.search = searchQuery
    if (genreId) params.genre = genreId
    setSearchParams(params, { replace: true })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Update URL
    const params: Record<string, string> = {}
    if (activeSearchQuery) params.search = activeSearchQuery
    if (selectedGenre) params.genre = selectedGenre
    if (page > 1) params.page = page.toString()
    setSearchParams(params, { replace: true })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  return (
    <Layout
      headerActions={
        <Link
          to="/status"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>System Status</span>
        </Link>
      }
    >
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Error State */}
          {moviesError ? (
            <ErrorDisplay
              title="Error Loading Movies"
              message={moviesError.message}
            />
          ) : (
            <>
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
                onGetRecommendations={fetchRecommendations}
                isGettingRecommendations={recommendations.isLoading}
              />

              {/* Recommendation Error */}
              <RecommendationsError 
                error={recommendations.error}
                onDismiss={clearRecommendations}
              />

              {/* Recommendations Banner */}
              {recommendations.isActive && recommendations.movies.length > 0 && (
                <Card variant="gradient-purple" className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        AI Recommendations
                      </h2>
                      <p className="text-purple-200">Based on your viewing history and preferences</p>
                    </div>
                    <button
                      onClick={clearRecommendations}
                      className="text-purple-300 hover:text-purple-100 font-medium"
                    >
                      Clear & Return to Search
                    </button>
                  </div>
                </Card>
              )}

              {/* Movie Grid */}
              <MovieGrid
                movies={recommendations.isActive ? recommendations.movies : movies}
                viewMode={viewMode}
                isLoading={recommendations.isActive ? recommendations.isLoading : moviesFetching}
                totalResults={recommendations.isActive ? recommendations.movies.length : totalResults}
                searchContext={{ query: activeSearchQuery, genre: selectedGenre }}
              />

              {/* Pagination */}
              {!recommendations.isActive && pagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  isLoading={moviesFetching}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default SearchPage
