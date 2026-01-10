import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { useEffect } from 'react'
import { GET_MOVIE } from '../graphql/queries'
import { useActivityStore } from '../store/userActivity'
import MoviePoster from '../components/MoviePoster'

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const addMovieViewEvent = useActivityStore((state) => state.addMovieViewEvent)
  
  const [result] = useQuery({
    query: GET_MOVIE,
    variables: { id },
  })

  const { data, fetching, error } = result
  const movie = data?.movie

  // Track movie view when data loads
  useEffect(() => {
    if (movie && !fetching) {
      // Get context from where user came from (if available)
      const referrerSearch = document.referrer.includes('search=')
        ? new URL(document.referrer).searchParams.get('search')
        : undefined
      const referrerGenre = document.referrer.includes('genre=')
        ? new URL(document.referrer).searchParams.get('genre')
        : undefined

      addMovieViewEvent({
        movieId: movie.id,
        movieTitle: movie.title,
        genres: movie.genres?.map((g) => g.title) || [],
        fromSearch: referrerSearch || undefined,
        fromGenre: referrerGenre || undefined,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie, fetching])

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading movie details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Movie</h2>
            <p className="text-red-300 mb-4">{error?.message || 'Movie not found'}</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const rating = movie.ratingValue ? movie.ratingValue.toFixed(1) : 'N/A'
  const year = movie.datePublished ? new Date(movie.datePublished).getFullYear() : 'N/A'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Back Button */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </Link>
        </div>
      </div>

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
                <div className="flex flex-wrap items-center gap-4 text-lg text-gray-400 mb-6">
                  <span>{year}</span>
                  {movie.duration && (
                    <>
                      <span>•</span>
                      <span>{movie.duration}</span>
                    </>
                  )}
                  {movie.rating && (
                    <>
                      <span>•</span>
                      <span className="text-gray-300">{movie.rating}</span>
                    </>
                  )}
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
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <Link
                          key={genre.id}
                          to={`/?genre=${encodeURIComponent(genre.title)}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          {genre.title}
                        </Link>
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
            {/* Directors */}
            {movie.directors && movie.directors.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-blue-400">Directors</h3>
                <ul className="space-y-2">
                  {movie.directors.map((director, index) => (
                    <li key={index} className="text-gray-300">
                      {director}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Writers */}
            {movie.writers && movie.writers.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-blue-400">Writers</h3>
                <ul className="space-y-2">
                  {movie.writers.map((writer, index) => (
                    <li key={index} className="text-gray-300">
                      {writer}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Actors */}
            {movie.mainActors && movie.mainActors.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-blue-400">Cast</h3>
                <ul className="space-y-2">
                  {movie.mainActors.map((actor, index) => (
                    <li key={index} className="text-gray-300">
                      {actor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
