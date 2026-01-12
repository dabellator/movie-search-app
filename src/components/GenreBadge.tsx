import { Link } from 'react-router-dom'
import { getGenreSearchUrl } from '../utils/routing'

type BadgeVariant = 'small' | 'large'

interface GenreBadgeProps {
  genre: {
    id: string
    title: string
  }
  variant?: BadgeVariant
  onClick?: (e: React.MouseEvent) => void
}

const variantClasses = {
  small: 'px-2 py-1 text-xs bg-blue-600/30 text-blue-300 rounded-full border border-blue-500/50',
  large: 'px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold',
}

const hoverClasses = 'hover:bg-blue-600 hover:text-white transition-colors'

const GenreBadge = ({ genre, variant = 'small', onClick }: GenreBadgeProps) => (
  <Link
    to={getGenreSearchUrl(genre.title)}
    onClick={onClick}
    className={`${variantClasses[variant]} ${hoverClasses}`}
  >
    {genre.title}
  </Link>
)

export default GenreBadge
