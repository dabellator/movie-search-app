export interface Movie {
  id: string
  title: string
  posterUrl: string | null
  summary: string | null
  duration: string | null
  directors: string[]
  mainActors: string[]
  datePublished: string | null
  rating: string | null
  ratingValue: number | null
  bestRating: number | null
  worstRating: number | null
  writers: string[]
  genres: GenreWithoutMovies[]
}

export interface Genre {
  id: string
  title: string
  movies?: Movie[]
}

export interface GenreWithoutMovies {
  id: string
  title: string
}

export interface Pagination {
  page: number
  perPage: number
  totalPages: number
}

export interface PaginationInput {
  page?: number
  perPage?: number
}

export interface MovieFilterInput {
  search?: string
  genre?: string
}

export interface MovieConnection {
  nodes: Movie[]
  pagination: Pagination
}

export interface GenreConnection {
  nodes: Genre[]
  pagination: Pagination
}
