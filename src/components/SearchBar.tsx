import { useState, type KeyboardEvent } from 'react'
import type { Genre } from '../types/movie'
import LoadingSpinner from './LoadingSpinner'

interface SearchBarProps {
  searchQuery: string
  selectedGenre: string | null
  genres: Genre[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
  onSearchChange: (query: string) => void
  onGenreChange: (genreId: string | null) => void
  onSearchSubmit: () => void
  onViewModeChange: (mode: 'grid' | 'list') => void
  onGetRecommendations: () => void
  isGettingRecommendations?: boolean
}

const SearchBar = ({
  searchQuery,
  selectedGenre,
  genres,
  viewMode,
  isLoading,
  onSearchChange,
  onGenreChange,
  onSearchSubmit,
  onViewModeChange,
  onGetRecommendations,
  isGettingRecommendations = false,
}: SearchBarProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleInputChange = (value: string) => {
    setLocalQuery(value)
    onSearchChange(value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit()
    }
  }

  const handleClear = () => {
    setLocalQuery('')
    onSearchChange('')
    onGenreChange(null)
  }

  const hasFilters = searchQuery || selectedGenre

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border-2 border-gray-700 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-2">
            Search Movies
          </label>
          <input
            id="search"
            type="text"
            value={localQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter movie title..."
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Genre Filter */}
        <div className="md:w-64">
          <label htmlFor="genre" className="block text-sm font-medium text-gray-400 mb-2">
            Filter by Genre
          </label>
          <select
            id="genre"
            value={selectedGenre || ''}
            onChange={(e) => onGenreChange(e.target.value || null)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.title}>
                {genre.title}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-end gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            disabled={isLoading}
            className={`p-3 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              viewMode === 'grid'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
            }`}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            disabled={isLoading}
            className={`p-3 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              viewMode === 'list'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
            }`}
            title="List View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Clear Filters & AI Recommendations */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
        {hasFilters ? (
          <div className="text-sm text-gray-400">
            {searchQuery && (
              <span>
                Searching for: <span className="text-white font-semibold">"{searchQuery}"</span>
              </span>
            )}
            {searchQuery && selectedGenre && <span className="mx-2">•</span>}
            {selectedGenre && (
              <span>
                Genre: <span className="text-white font-semibold">{selectedGenre}</span>
              </span>
            )}
          </div>
        ) : (
          <div className="flex-1"></div>
        )}
        
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear filters
            </button>
          )}
          
          <button
            onClick={onGetRecommendations}
            disabled={isLoading || isGettingRecommendations}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isGettingRecommendations ? (
              <>
                <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                <span>Getting Recommendations...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>AI Recommendations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
