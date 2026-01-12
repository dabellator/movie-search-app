import type { ReactNode } from 'react'

// Base card component with consistent styling and color variants
// Supports default, error, success, warning, info, and gradient-purple variants
type CardVariant = 
  | 'default' 
  | 'error' 
  | 'success' 
  | 'warning' 
  | 'info' 
  | 'gradient-purple'

type CardPadding = 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  variant?: CardVariant
  padding?: CardPadding
  noBorder?: boolean
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-gray-800 border-gray-700',
  error: 'bg-red-900/20 border-red-500',
  success: 'bg-green-900/30 border-green-500',
  warning: 'bg-yellow-900/20 border-yellow-500',
  info: 'bg-blue-900/20 border-blue-500',
  'gradient-purple': 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500',
}

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  noBorder = false,
  className = '' 
}: CardProps) => {
  const variantClasses = variantStyles[variant]
  const paddingClass = paddingStyles[padding]
  const borderClass = noBorder ? '' : 'border-2'

  return (
    <div className={`rounded-lg ${paddingClass} ${borderClass} ${variantClasses} ${className}`}>
      {children}
    </div>
  )
}

export default Card
