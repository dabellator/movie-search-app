import type { Movie } from '../types/movie'
import MovieCard from './MovieCard'
import LoadingSpinner from './LoadingSpinner'
import Card from './Card'

interface MovieGridProps {
  movies: Movie[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
  totalResults: number
  searchContext?: {
    query?: string
    genre?: string | null
  }
}

const MovieGrid = ({ movies, viewMode, isLoading, totalResults, searchContext }: MovieGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </Card>
    )
  }

  return (
    <div>
      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-400">
          Found <span className="text-white font-semibold">{totalResults}</span> {totalResults === 1 ? 'movie' : 'movies'}
        </p>
      </div>

      {/* Movies Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} viewMode={viewMode} searchContext={searchContext} />
        ))}
      </div>
    </div>
  )
}

export default MovieGrid
