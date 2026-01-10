import { gql } from 'urql'

export const SEARCH_MOVIES = gql`
  query SearchMovies($pagination: PaginationInput, $where: MovieFilterInput) {
    movies(pagination: $pagination, where: $where) {
      nodes {
        id
        title
        posterUrl
        summary
        duration
        directors
        mainActors
        datePublished
        rating
        ratingValue
        bestRating
        worstRating
        writers
        genres {
          id
          title
        }
      }
      pagination {
        page
        perPage
        totalPages
      }
    }
  }
`

export const GET_GENRES = gql`
  query GetGenres($pagination: PaginationInput) {
    genres(pagination: $pagination) {
      nodes {
        id
        title
      }
      pagination {
        page
        perPage
        totalPages
      }
    }
  }
`

export const GET_MOVIE = gql`
  query GetMovie($id: ID!) {
    movie(id: $id) {
      id
      title
      posterUrl
      summary
      duration
      directors
      mainActors
      datePublished
      rating
      ratingValue
      bestRating
      worstRating
      writers
      genres {
        id
        title
      }
    }
  }
`
