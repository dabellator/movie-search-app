// Routing utility functions

// Get URL for genre search
export function getGenreSearchUrl(genreTitle: string): string {
  return `/?genre=${encodeURIComponent(genreTitle)}`
}

// Get URL for movie details page
export function getMovieDetailUrl(movieId: string): string {
  return `/movie/${movieId}`
}
