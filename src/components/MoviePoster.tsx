import { useState } from 'react'

interface MoviePosterProps {
  src: string | null
  alt: string
  className?: string
}

// Film reel SVG image
const FALLBACK_POSTER = '/film_reel.svg'

const MoviePoster = ({ src, alt, className = '' }: MoviePosterProps) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_POSTER)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(FALLBACK_POSTER)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  )
}

export default MoviePoster
