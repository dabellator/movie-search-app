import type { ReactNode } from 'react'
import Card from './Card'

// Reusable error display component with optional dismiss button
// Supports both page-level errors (default) and compact inline errors
interface ErrorDisplayProps {
  title?: string
  message: string
  children?: ReactNode
  compact?: boolean
  onDismiss?: () => void
  className?: string
}

const ErrorDisplay = ({ 
  title = 'Error', 
  message,
  children,
  compact = false,
  onDismiss,
  className = ''
}: ErrorDisplayProps) => {
  const titleSize = compact ? 'text-sm font-semibold' : 'text-2xl font-bold'
  const messageSize = compact ? 'text-sm' : 'text-base'
  const spacing = compact ? 'mb-1' : 'mb-2'
  const childSpacing = compact ? 'mt-2' : 'mt-4'
  const padding = compact ? 'sm' : 'md'

  return (
    <Card variant="error" padding={padding} className={className}>
      <div className={onDismiss ? 'flex items-start justify-between' : ''}>
        <div className={onDismiss ? 'flex-1' : ''}>
          <h2 className={`${titleSize} text-red-400 ${spacing}`}>{title}</h2>
          <p className={`${messageSize} text-red-300 ${compact ? 'font-mono' : ''}`}>{message}</p>
          {children && <div className={childSpacing}>{children}</div>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 ml-4"
          >
            ✕
          </button>
        )}
      </div>
    </Card>
  )
}

export default ErrorDisplay
