import { Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import MoviePoster from './MoviePoster'
import GenreBadge from './GenreBadge'

interface MovieCardGridProps {
  movie: Movie
  rating: string
  year: string | number
  movieUrl: string
  onClickTracking: () => void
}

// Presentational component for grid view of a movie card
const MovieCardGrid = ({ 
  movie, 
  rating, 
  year, 
  movieUrl, 
  onClickTracking 
}: MovieCardGridProps) => (
    <Link
      to={movieUrl}
      onClick={onClickTracking}
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

        {/* Meta Info */}
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
        {movie.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre) => (
              <GenreBadge
                key={genre.id}
                genre={genre}
                variant="small"
                onClick={(e) => e.stopPropagation()}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
)

export default MovieCardGrid
