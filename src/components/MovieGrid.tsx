import type { Movie } from '../types/movie'
import MovieCard from './MovieCard'

interface MovieGridProps {
  movies: Movie[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
  totalResults: number
}

export default function MovieGrid({ movies, viewMode, isLoading, totalResults }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border-2 border-gray-700">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div>
      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-400">
          Found <span className="text-white font-semibold">{totalResults}</span> movies
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
          <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
        ))}
      </div>
    </div>
  )
}
