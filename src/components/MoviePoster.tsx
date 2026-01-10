import { useState } from 'react'

interface MoviePosterProps {
  src: string | null
  alt: string
  className?: string
}

// SVG film roll on gray background
const FALLBACK_POSTER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect fill='%231f2937' width='300' height='450'/%3E%3Cg transform='translate(150,225)'%3E%3C!-- Film strip --%3E%3Crect x='-50' y='-80' width='100' height='160' fill='%234b5563' rx='8'/%3E%3Crect x='-40' y='-70' width='80' height='50' fill='%236b7280' rx='4'/%3E%3Crect x='-40' y='-10' width='80' height='50' fill='%236b7280' rx='4'/%3E%3C!-- Perforations --%3E%3Crect x='-48' y='-75' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='-75' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='-48' y='-55' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='-55' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='-48' y='-35' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='-35' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='-48' y='-15' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='-15' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='-48' y='5' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='5' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='-48' y='25' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='25' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='-48' y='45' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='45' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='-48' y='65' width='8' height='8' fill='%231f2937' rx='2'/%3E%3Crect x='40' y='65' width='8' height='8' fill='%231f2937' rx='2'/%3E%3C/g%3E%3C/svg%3E`

export default function MoviePoster({ src, alt, className = '' }: MoviePosterProps) {
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
