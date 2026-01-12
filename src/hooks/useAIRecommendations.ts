import { useState } from 'react'
import { useMovieSearch } from './useMovieSearch'
import { getAIRecommendations } from '../services/aiRecommendations'
import type { Movie } from '../types/movie'

// Hook to manage AI-powered movie recommendations
// Uses OpenAI to generate recommendations based on user activity, then searches the database for matching movies
interface RecommendationState {
  movies: Movie[]
  isLoading: boolean
  error: string | null
  isActive: boolean
}

export function useAIRecommendations() {
  const { searchMultipleTitles } = useMovieSearch()
  const [state, setState] = useState<RecommendationState>({
    movies: [],
    isLoading: false,
    error: null,
    isActive: false,
  })

  const fetchRecommendations = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null, isActive: false }))

    try {
      // Get AI recommendations (movie titles)
      const recommendedTitles = await getAIRecommendations()

      // Search for each recommended movie using urql
      const validMovies = await searchMultipleTitles(recommendedTitles)

      setState({
        movies: validMovies,
        isLoading: false,
        error: validMovies.length === 0 
          ? 'No matching movies found for the recommendations. Try searching more movies first!'
          : null,
        isActive: true,
      })
    } catch (error) {
      console.error('Recommendation error:', error)
      setState({
        movies: [],
        isLoading: false,
        error: error instanceof Error 
          ? error.message 
          : 'Failed to get recommendations. Please check your API key configuration.',
        isActive: false,
      })
    }
  }

  const clearRecommendations = () => {
    setState({
      movies: [],
      isLoading: false,
      error: null,
      isActive: false,
    })
  }

  return {
    recommendations: state,
    fetchRecommendations,
    clearRecommendations,
  }
}
