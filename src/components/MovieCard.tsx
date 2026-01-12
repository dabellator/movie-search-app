import type { Movie } from '../types/movie'
import { useActivityStore } from '../store/userActivity'
import { getMovieMetadata } from '../utils/movieHelpers'
import { getMovieDetailUrl } from '../utils/routing'
import MovieCardGrid from './MovieCardGrid'
import MovieCardList from './MovieCardList'

interface MovieCardProps {
  movie: Movie
  viewMode: 'grid' | 'list'
  searchContext?: {
    query?: string
    genre?: string | null
  }
}

// MovieCard container component that handles shared logic and delegates to view implementations
const MovieCard = ({ movie, viewMode, searchContext }: MovieCardProps) => {
  // Shared hooks and data preparation
  const addMovieViewEvent = useActivityStore((state) => state.addMovieViewEvent)
  const { rating, year } = getMovieMetadata(movie)
  const movieUrl = getMovieDetailUrl(movie.id)

  // Shared event handler
  const handleClick = () => {
    addMovieViewEvent({
      movieId: movie.id,
      movieTitle: movie.title,
      genres: movie.genres?.map(g => g.title) || [],
      fromSearch: searchContext?.query || undefined,
      fromGenre: searchContext?.genre || undefined,
    })
  }

  // Delegate to appropriate view component
  const viewProps = {
    movie,
    rating,
    year,
    movieUrl,
    onClickTracking: handleClick,
  }

  if (viewMode === 'list') {
    return <MovieCardList {...viewProps} />
  }

  return <MovieCardGrid {...viewProps} />
}

export default MovieCard
