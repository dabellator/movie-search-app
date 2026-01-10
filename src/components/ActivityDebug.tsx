import { useState } from 'react'
import { useActivityStore } from '../store/userActivity'

export default function ActivityDebug() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { events, preferences, getActivityForAI, clearAllData } = useActivityStore()
  const aiData = getActivityForAI()

  if (!isExpanded) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border-2 border-purple-700">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between text-purple-400 hover:text-purple-300"
        >
          <span className="font-semibold">🤖 User Activity Tracking (Debug)</span>
          <span className="text-sm">
            {events.length} events tracked • Click to expand
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border-2 border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-purple-400">
          🤖 User Activity Tracking
        </h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-2xl font-bold text-white">{events.length}</div>
          <div className="text-sm text-gray-400">Total Events</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-2xl font-bold text-white">
            {events.filter((e) => e.type === 'search').length}
          </div>
          <div className="text-sm text-gray-400">Searches</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-2xl font-bold text-white">
            {events.filter((e) => e.type === 'movie_view').length}
          </div>
          <div className="text-sm text-gray-400">Movies Viewed</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-2xl font-bold text-white">
            {Object.keys(preferences.topGenres).length}
          </div>
          <div className="text-sm text-gray-400">Genres Engaged</div>
        </div>
      </div>

      {/* AI Prompt Data */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">
          AI Recommendation Data
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-400">Summary:</span>
            <p className="text-gray-300 mt-1 italic">"{aiData.activitySummary}"</p>
          </div>
          {aiData.recentSearches.length > 0 && (
            <div>
              <span className="text-gray-400">Recent Searches:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {aiData.recentSearches.map((search, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs"
                  >
                    {search}
                  </span>
                ))}
              </div>
            </div>
          )}
          {aiData.topGenres.length > 0 && (
            <div>
              <span className="text-gray-400">Top Genres:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {aiData.topGenres.slice(0, 5).map((item) => (
                  <span
                    key={item.genre}
                    className="px-2 py-1 bg-green-600/30 text-green-300 rounded text-xs"
                  >
                    {item.genre} ({item.count})
                  </span>
                ))}
              </div>
            </div>
          )}
          {aiData.recentlyViewed.length > 0 && (
            <div>
              <span className="text-gray-400">Recently Viewed:</span>
              <div className="space-y-1 mt-1">
                {aiData.recentlyViewed.slice(0, 5).map((movie, i) => (
                  <div key={i} className="text-gray-300 text-xs">
                    • {movie.title} <span className="text-gray-500">({movie.genres.join(', ')})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Raw Events (Last 10) */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">
          Recent Events (Last 10)
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events
            .slice(-10)
            .reverse()
            .map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded p-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-purple-400">{event.type}</span>
                  <span className="text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-gray-300">
                  {event.type === 'search' && (
                    <>Query: "{event.query}" {event.genre && `• Genre: ${event.genre}`}</>
                  )}
                  {event.type === 'movie_view' && (
                    <>Movie: {event.movieTitle} • Genres: {event.genres.join(', ')}</>
                  )}
                  {event.type === 'genre_filter' && (
                    <>Genre: {event.genre}</>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Clear Data Button */}
      <button
        onClick={() => {
          if (window.confirm('Clear all tracked activity data?')) {
            clearAllData()
          }
        }}
        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
      >
        Clear All Activity Data
      </button>
    </div>
  )
}
