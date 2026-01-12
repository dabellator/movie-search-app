import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'urql'
import { GET_MOVIE } from '../graphql/queries'
import { getMovieMetadata } from '../utils/movieHelpers'
import Layout from '../components/Layout'
import MoviePoster from '../components/MoviePoster'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import MovieMetaInfo from '../components/MovieMetaInfo'
import GenreBadge from '../components/GenreBadge'
import CrewCard from '../components/CrewCard'
import type { GenreWithoutMovies } from '../types/movie'

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>()

  const [result] = useQuery({
    query: GET_MOVIE,
    variables: { id },
  })

  const { data, fetching, error } = result
  const movie = data?.movie

  const { rating, year } = getMovieMetadata(movie)

  return (
    <Layout
      headerActions={
        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
          ← Back to Search
        </Link>
      }
    >
      {/* Loading State */}
      {fetching ? (
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="xl" className="mb-4" />
                <p className="text-gray-400">Loading movie details...</p>
              </div>
            </div>
          </div>
        </div>
      ) : error || !movie ? (
        /* Error State */
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <ErrorDisplay
              title="Error Loading Movie"
              message={error?.message || 'Movie not found'}
            >
              <Link to="/" className="text-blue-400 hover:text-blue-300">
                ← Back to Search
              </Link>
            </ErrorDisplay>
          </div>
        </div>
      ) : (
        /* Movie Details Content */
        <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 mb-8">
            <div className="grid md:grid-cols-3 gap-8 p-8">
              {/* Poster */}
              <div className="md:col-span-1">
                <MoviePoster
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                
                {/* Meta Info */}
                <div className="mb-6">
                  <MovieMetaInfo
                    year={year}
                    duration={movie.duration}
                    rating={rating}
                    ratingLabel={movie.rating}
                    variant="full"
                  />
                </div>

                {/* Rating */}
                {rating !== 'N/A' && (
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-3 bg-yellow-600/20 border-2 border-yellow-600 rounded-lg px-6 py-3">
                      <span className="text-yellow-400 text-3xl">⭐</span>
                      <div>
                        <div className="text-3xl font-bold text-white">{rating}</div>
                        {movie.bestRating && (
                          <div className="text-sm text-gray-400">
                            out of {movie.bestRating}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Genres */}
                {movie.genres?.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre: GenreWithoutMovies) => (
                        <GenreBadge
                          key={genre.id}
                          genre={genre}
                          variant="large"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {movie.summary && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {movie.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cast & Crew */}
          <div className="grid md:grid-cols-3 gap-6">
            <CrewCard title="Directors" items={movie.directors || []} />
            <CrewCard title="Writers" items={movie.writers || []} />
            <CrewCard title="Cast" items={movie.mainActors || []} />
          </div>
        </div>
        </div>
      )}
    </Layout>
  )
}

export default MovieDetailsPage
