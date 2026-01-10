import { useQuery } from 'urql'
import { SEARCH_MOVIES, GET_GENRES } from '../graphql/queries'
import ActivityDebug from './ActivityDebug'

export default function StatusPage() {
  // Test API connection with a simple search
  const [moviesResult] = useQuery({
    query: SEARCH_MOVIES,
    variables: { 
      pagination: { page: 1, perPage: 5 },
      where: { search: 'Star Wars' }
    },
  })

  const [genresResult] = useQuery({
    query: GET_GENRES,
    variables: {
      pagination: { page: 1, perPage: 20 }
    }
  })

  const { data: moviesData, fetching: moviesFetching, error: moviesError } = moviesResult
  const { data: genresData, fetching: genresFetching, error: genresError } = genresResult

  const getStatusIndicator = (fetching: boolean, error: any, data: any) => {
    if (fetching) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-yellow-500 font-semibold">CHECKING</span>
        </div>
      )
    }
    if (error) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-red-500 font-semibold">DOWN</span>
        </div>
      )
    }
    if (data) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-500 font-semibold">OPERATIONAL</span>
        </div>
      )
    }
    return null
  }

  const allOperational = !moviesFetching && !genresFetching && !moviesError && !genresError && moviesData && genresData

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Status</h1>
          <p className="text-gray-400">Real-time status of Movies API services</p>
        </div>

        {/* Overall Status Banner */}
        <div className={`rounded-lg p-6 mb-8 ${allOperational ? 'bg-green-900/30 border-2 border-green-500' : 'bg-gray-800 border-2 border-gray-700'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {allOperational ? 'All Systems Operational' : 'System Status Check'}
              </h2>
              <p className="text-gray-400">
                {allOperational ? 'All services are running smoothly' : 'Monitoring service health...'}
              </p>
            </div>
            <div className="text-5xl">
              {allOperational ? '✓' : moviesFetching || genresFetching ? '○' : '⚠'}
            </div>
          </div>
        </div>

        {/* Service Status Cards */}
        <div className="space-y-4">
          {/* Movies Search Service */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Movies Search API</h3>
              {getStatusIndicator(moviesFetching, moviesError, moviesData)}
            </div>
            
            <div className="text-sm text-gray-400 mb-3">
              <p className="font-mono">GET /graphql → movies</p>
            </div>

            {moviesError && (
              <div className="bg-red-900/20 border border-red-500 rounded p-3 mb-3">
                <p className="text-red-400 text-sm font-semibold">Error Details:</p>
                <p className="text-red-300 text-sm mt-1 font-mono">{moviesError.message}</p>
              </div>
            )}

            {moviesData && (
              <div className="bg-gray-700 rounded p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Results Found:</span>
                  <span className="text-white font-semibold">{moviesData.movies?.nodes?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Test Query:</span>
                  <span className="text-white font-mono">"Star Wars"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Pages:</span>
                  <span className="text-white font-semibold">{moviesData.movies?.pagination?.totalPages || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Genres Service */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Genres API</h3>
              {getStatusIndicator(genresFetching, genresError, genresData)}
            </div>
            
            <div className="text-sm text-gray-400 mb-3">
              <p className="font-mono">GET /graphql → genres</p>
            </div>

            {genresError && (
              <div className="bg-red-900/20 border border-red-500 rounded p-3 mb-3">
                <p className="text-red-400 text-sm font-semibold">Error Details:</p>
                <p className="text-red-300 text-sm mt-1 font-mono">{genresError.message}</p>
              </div>
            )}

            {genresData && (
              <div className="bg-gray-700 rounded p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available Genres:</span>
                  <span className="text-white font-semibold">{genresData.genres?.nodes?.length || 0}</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Sample Genres:</p>
                  <div className="flex flex-wrap gap-2">
                    {genresData.genres?.nodes?.slice(0, 8).map((genre: any) => (
                      <span key={genre.id} className="bg-blue-600 px-2 py-1 rounded text-xs">
                        {genre.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Tracking Debug */}
        <div className="mt-8">
          <ActivityDebug />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Status checks run automatically • Last checked: {new Date().toLocaleTimeString()}</p>
          <p className="mt-1">API Endpoint: https://0kadddxyh3.execute-api.us-east-1.amazonaws.com</p>
        </div>
      </div>
    </div>
  )
}
