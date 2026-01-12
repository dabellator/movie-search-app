import ErrorDisplay from './ErrorDisplay'

interface RecommendationsErrorProps {
  error: string | null
  onDismiss: () => void
}

const RecommendationsError = ({ error, onDismiss }: RecommendationsErrorProps) => {
  if (!error) return null

  return (
    <ErrorDisplay
      title="⚠️ Recommendation Error"
      message={error}
      compact
      onDismiss={onDismiss}
      className="mb-6"
    />
  )
}

export default RecommendationsError
