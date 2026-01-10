import { Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import MoviePoster from './MoviePoster'

interface MovieCardProps {
  movie: Movie
  viewMode: 'grid' | 'list'
}

export default function MovieCard({ movie, viewMode }: MovieCardProps) {
  const rating = movie.ratingValue ? movie.ratingValue.toFixed(1) : 'N/A'
  const year = movie.datePublished ? new Date(movie.datePublished).getFullYear() : 'N/A'

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/movie/${movie.id}`}
        className="block bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Poster */}
          <div className="sm:w-40 flex-shrink-0">
            <MoviePoster
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-48 sm:h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{year}</span>
                  {movie.duration && (
                    <>
                      <span>•</span>
                      <span>{movie.duration}</span>
                    </>
                  )}
                  {rating !== 'N/A' && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        {rating}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            {movie.summary && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{movie.summary}</p>
            )}

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/?genre=${encodeURIComponent(genre.title)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full border border-blue-500/50 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {genre.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Directors/Actors */}
            <div className="text-xs text-gray-400 space-y-1">
              {movie.directors && movie.directors.length > 0 && (
                <p>
                  <span className="font-semibold">Director:</span> {movie.directors.join(', ')}
                </p>
              )}
              {movie.mainActors && movie.mainActors.length > 0 && (
                <p>
                  <span className="font-semibold">Cast:</span> {movie.mainActors.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid view
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="block bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-all hover:scale-105"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <MoviePoster
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {rating !== 'N/A' && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-white font-semibold text-sm">{rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {movie.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <span>{year}</span>
          {movie.duration && (
            <>
              <span>•</span>
              <span>{movie.duration}</span>
            </>
          )}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre) => (
              <Link
                key={genre.id}
                to={`/?genre=${encodeURIComponent(genre.title)}`}
                onClick={(e) => e.stopPropagation()}
                className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full border border-blue-500/50 hover:bg-blue-600 hover:text-white transition-colors"
              >
                {genre.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
