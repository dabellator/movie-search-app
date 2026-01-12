import type { ReactNode } from 'react'
import Card from './Card'
import ErrorDisplay from './ErrorDisplay'
import StatusIndicator from './StatusIndicator'

type Status = 'checking' | 'operational' | 'down'

interface Metric {
  label: string
  value: string | number
}

interface ServiceStatusCardProps {
  name: string
  endpoint: string
  status: Status
  error?: string | null
  metrics?: Metric[]
  children?: ReactNode
  warningMessage?: string
}

const ServiceStatusCard = ({
  name,
  endpoint,
  status,
  error,
  metrics,
  children,
  warningMessage
}: ServiceStatusCardProps) => (
  <Card variant="default">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{name}</h3>
      <StatusIndicator status={status} />
    </div>

    {/* Endpoint */}
    <div className="text-sm text-gray-400 mb-3">
      <p className="font-mono">{endpoint}</p>
    </div>

    {/* Warning Message */}
    {warningMessage && (
      <Card variant="warning" padding="sm" className="mb-3">
        <p className="text-yellow-400 text-sm font-semibold mb-1">Configuration Needed:</p>
        <p className="text-yellow-300 text-sm">{warningMessage}</p>
      </Card>
    )}

    {/* Error Display */}
    {error && (
      <ErrorDisplay 
        title="Error Details" 
        message={error}
        compact
        className="mb-3"
      />
    )}

    {/* Success Metrics */}
    {metrics && metrics.length > 0 && (
      <div className="bg-gray-700 rounded p-4 space-y-2">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-400">{metric.label}:</span>
            <span className="text-white font-semibold font-mono">{metric.value}</span>
          </div>
        ))}
      </div>
    )}

    {/* Custom Content */}
    {children && <div className="mt-3">{children}</div>}
  </Card>
)

export default ServiceStatusCard
