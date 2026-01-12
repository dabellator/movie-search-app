import { useQuery } from 'urql'
import { Link } from 'react-router-dom'
import { SEARCH_MOVIES, GET_GENRES } from '../graphql/queries'
import { useAIStatus } from '../hooks/useAIStatus'
import { API_ENDPOINTS, PAGINATION } from '../utils/constants'
import Layout from '../components/Layout'
import Card from '../components/Card'
import AnimatedStatusCheck from '../components/AnimatedStatusCheck'
import ServiceStatusCard from '../components/ServiceStatusCard'
import ActivityDebug from '../components/ActivityDebug'

const StatusPage = () => {
  const aiStatus = useAIStatus()

  // Test API connection with a simple search
  const [moviesResult] = useQuery({
    query: SEARCH_MOVIES,
    variables: { 
      pagination: { page: 1, perPage: PAGINATION.STATUS_TEST_MOVIES },
      where: { search: 'Star Wars' }
    },
  })

  const [genresResult] = useQuery({
    query: GET_GENRES,
    variables: {
      pagination: { page: 1, perPage: PAGINATION.STATUS_TEST_GENRES }
    }
  })

  const { data: moviesData, fetching: moviesFetching, error: moviesError } = moviesResult
  const { data: genresData, fetching: genresFetching, error: genresError } = genresResult

  const allOperational = 
    !moviesFetching && 
    !genresFetching && 
    !moviesError && 
    !genresError && 
    moviesData && 
    genresData && 
    aiStatus.operational === true

  return (
    <Layout 
      headerActions={
        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
          ← Back to Search
        </Link>
      }
    >
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">System Status</h1>
            <p className="text-gray-400">Real-time status of Movies API services</p>
          </div>

          {/* Overall Status Banner */}
          <Card 
            variant={allOperational ? 'success' : 'default'} 
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {allOperational ? 'All Systems Operational' : 'System Status Check'}
                </h2>
                <p className="text-gray-400">
                  {allOperational 
                    ? 'All services are running smoothly' 
                    : 'Monitoring service health...'}
                </p>
              </div>
              <AnimatedStatusCheck 
                status={allOperational ? 'operational' : (moviesFetching || genresFetching) ? 'checking' : 'error'}
                size="md" 
              />
            </div>
          </Card>

          {/* Service Status Cards */}
          <div className="space-y-4">
            {/* Movies Search Service */}
            <ServiceStatusCard
              name="Movies Search API"
              endpoint="GET /graphql → movies"
              status={
                moviesFetching 
                  ? 'checking' 
                  : moviesError 
                    ? 'down' 
                    : 'operational'
              }
              error={moviesError?.message}
              metrics={moviesData ? [
                { label: 'Results Found', value: moviesData.movies?.nodes?.length || 0 },
                { label: 'Test Query', value: '"Star Wars"' },
                { label: 'Total Pages', value: moviesData.movies?.pagination?.totalPages || 0 }
              ] : undefined}
            />

            {/* Genres Service */}
            <ServiceStatusCard
              name="Genres API"
              endpoint="GET /graphql → genres"
              status={
                genresFetching 
                  ? 'checking' 
                  : genresError 
                    ? 'down' 
                    : 'operational'
              }
              error={genresError?.message}
              metrics={genresData ? [
                { label: 'Available Genres', value: genresData.genres?.nodes?.length || 0 }
              ] : undefined}
            >
              {genresData && genresData.genres?.nodes && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Sample Genres:</p>
                  <div className="flex flex-wrap gap-2">
                    {genresData.genres.nodes.slice(0, 8).map((genre: any) => (
                      <span key={genre.id} className="bg-blue-600 px-2 py-1 rounded text-xs">
                        {genre.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </ServiceStatusCard>

            {/* AI Recommendations Service */}
            <ServiceStatusCard
              name="AI Recommendations Service"
              endpoint="OpenAI API → gpt-4o-mini"
              status={
                aiStatus.operational === null 
                  ? 'checking' 
                  : aiStatus.operational 
                    ? 'operational' 
                    : 'down'
              }
              error={aiStatus.configured ? aiStatus.error : undefined}
              warningMessage={
                !aiStatus.configured 
                  ? 'Add VITE_OPENAI_API_KEY to your .env file to enable AI recommendations'
                  : undefined
              }
              metrics={aiStatus.operational ? [
                { label: 'API Key', value: '✓ Configured' },
                { label: 'Model', value: aiStatus.model || '' },
                { label: 'Connection', value: 'Verified' },
                { label: 'Feature', value: 'AI Recommendations Active' }
              ] : undefined}
            />
          </div>

          {/* Activity Tracking Debug */}
          <div className="mt-8">
            <ActivityDebug />
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Status checks run automatically • Last checked: {new Date().toLocaleTimeString()}</p>
            <p className="mt-1">API Endpoint: {API_ENDPOINTS.MOVIES_API}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StatusPage
