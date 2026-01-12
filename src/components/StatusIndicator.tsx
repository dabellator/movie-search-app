type Status = 'checking' | 'operational' | 'down'

interface StatusIndicatorProps {
  status: Status
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-yellow-500 font-semibold">CHECKING</span>
      </div>
    )
  }

  if (status === 'down') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="text-red-500 font-semibold">DOWN</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <span className="text-green-500 font-semibold">OPERATIONAL</span>
    </div>
  )
}

export default StatusIndicator
