type MetaVariant = 'compact' | 'full'

interface MovieMetaInfoProps {
  year: string | number
  duration?: string | null
  rating?: string | null
  ratingLabel?: string | null
  variant?: MetaVariant
  showRating?: boolean
}

const MovieMetaInfo = ({
  year,
  duration,
  rating,
  ratingLabel,
  variant = 'compact',
  showRating = true,
}: MovieMetaInfoProps) => {
  const textSize = variant === 'full' ? 'text-lg' : 'text-sm'
  const textColor = variant === 'full' ? 'text-gray-400' : 'text-gray-400'

  return (
    <div className={`flex items-center gap-3 ${textSize} ${textColor}`}>
      <span>{year}</span>
      
      {duration && (
        <>
          <span>•</span>
          <span>{duration}</span>
        </>
      )}
      
      {showRating && rating && rating !== 'N/A' && (
        <>
          <span>•</span>
          <span className={variant === 'full' ? 'text-gray-300' : 'flex items-center gap-1'}>
            {variant === 'compact' && <span className="text-yellow-400">⭐</span>}
            {rating}
            {ratingLabel && variant === 'full' && ` ${ratingLabel}`}
          </span>
        </>
      )}
    </div>
  )
}

export default MovieMetaInfo
