import { useClient } from 'urql'
import { SEARCH_MOVIES } from '../graphql/queries'
import type { Movie } from '../types/movie'

// Custom hook to programmatically search for movies
// Returns functions that can search by title and return matching movies
export function useMovieSearch() {
  const client = useClient()

  const searchByTitle = async (title: string): Promise<Movie | null> => {
    try {
      const result = await client.query(SEARCH_MOVIES, {
        pagination: { page: 1, perPage: 1 },
        where: { search: title }
      }).toPromise()

      if (result.error) {
        console.error(`Error searching for "${title}":`, result.error)
        return null
      }

      return result.data?.movies?.nodes?.[0] || null
    } catch (error) {
      console.error(`Failed to search for "${title}":`, error)
      return null
    }
  }

  const searchMultipleTitles = async (titles: string[]): Promise<Movie[]> => {
    const promises = titles.map(title => searchByTitle(title))
    const results = await Promise.all(promises)
    return results.filter((movie): movie is Movie => movie !== null)
  }

  return {
    searchByTitle,
    searchMultipleTitles
  }
}
