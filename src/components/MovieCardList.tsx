import { Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import MoviePoster from './MoviePoster'
import MovieMetaInfo from './MovieMetaInfo'
import GenreBadge from './GenreBadge'

interface MovieCardListProps {
  movie: Movie
  rating: string
  year: string | number
  movieUrl: string
  onClickTracking: () => void
}

// Presentational component for list view of a movie card
const MovieCardList = ({ 
  movie, 
  rating, 
  year, 
  movieUrl, 
  onClickTracking 
}: MovieCardListProps) => (
    <Link 
      to={movieUrl}
      onClick={onClickTracking}
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
              <MovieMetaInfo
                year={year}
                duration={movie.duration}
                rating={rating}
                variant="compact"
              />
            </div>
          </div>

          {/* Summary */}
          {movie.summary && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{movie.summary}</p>
          )}

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres.map((genre) => (
                <GenreBadge
                  key={genre.id}
                  genre={genre}
                  variant="small"
                  onClick={(e) => e.stopPropagation()}
                />
              ))}
            </div>
          )}

          {/* Directors/Actors */}
          <div className="text-xs text-gray-400 space-y-1">
            {movie.directors?.length > 0 && (
              <p>
                <span className="font-semibold">Director:</span> {movie.directors.join(', ')}
              </p>
            )}
            {movie.mainActors?.length > 0 && (
              <p>
                <span className="font-semibold">Cast:</span> {movie.mainActors.slice(0, 3).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
)

export default MovieCardList
