type StatusState = 'checking' | 'operational' | 'error'

interface AnimatedStatusCheckProps {
  status: StatusState
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
}

const AnimatedStatusCheck = ({ status, size = 'md' }: AnimatedStatusCheckProps) => {
  const sizeClass = sizeClasses[size]

  if (status === 'operational') {
    return (
      <>
        <svg 
          className={sizeClass}
          viewBox="0 0 50 50"
        >
          {/* Animated circle */}
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-green-500"
            style={{
              strokeDasharray: 138,
              strokeDashoffset: 138,
              animation: 'drawCircle 0.5s ease-out forwards'
            }}
          />
          {/* Animated checkmark */}
          <path
            d="M14 25 L22 33 L36 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
            style={{
              strokeDasharray: 35,
              strokeDashoffset: 35,
              animation: 'drawCheck 0.3s ease-out 0.5s forwards, popCheck 0.2s ease-out 0.5s forwards',
              transformOrigin: 'center'
            }}
          />
        </svg>
        <style>{`
          @keyframes drawCircle {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes drawCheck {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes popCheck {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}</style>
      </>
    )
  }

  if (status === 'checking') {
    return (
      <svg 
        className={sizeClass}
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-400"
        />
      </svg>
    )
  }

  // error state
  return (
    <div className={`${sizeClass} flex items-center justify-center text-yellow-500 text-3xl`}>
      ⚠
    </div>
  )
}

export default AnimatedStatusCheck
