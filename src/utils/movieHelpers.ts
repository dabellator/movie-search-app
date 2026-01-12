import type { Movie } from '../types/movie'

// Format a movie rating value
export function formatRating(ratingValue?: number | null): string {
  return ratingValue ? ratingValue.toFixed(1) : 'N/A'
}

// Extract year from movie date
export function extractYear(datePublished?: string | null): string | number {
  return datePublished ? new Date(datePublished).getFullYear() : 'N/A'
}

// Get all movie metadata in one call
export function getMovieMetadata(movie: Movie | null | undefined) {
  if (!movie) {
    return { rating: 'N/A', year: 'N/A' }
  }
  return {
    rating: formatRating(movie.ratingValue),
    year: extractYear(movie.datePublished),
  }
}
