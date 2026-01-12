import Card from './Card'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <Card className="mt-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || isLoading}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold border-2 border-gray-600 hover:bg-gray-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 disabled:hover:border-gray-600 transition-colors"
        >
          ← Previous
        </button>

        {/* Page Info */}
        <div className="text-center">
          <p className="text-gray-400">
            Page{' '}
            <span className="text-white font-bold text-xl mx-1">{currentPage}</span>
            of{' '}
            <span className="text-white font-semibold">{totalPages}</span>
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold border-2 border-gray-600 hover:bg-gray-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 disabled:hover:border-gray-600 transition-colors"
        >
          Next →
        </button>
      </div>
    </Card>
  )
}

export default Pagination
