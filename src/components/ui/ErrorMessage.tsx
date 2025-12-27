'use client'

/**
 * Inline error message component with retry functionality
 */
interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}: ErrorMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

/**
 * Empty state message for when no content is available
 */
interface EmptyStateProps {
  message: string
  className?: string
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex items-center justify-center p-12 text-center ${className}`}
    >
      <p className="text-gray-500 font-light">{message}</p>
    </div>
  )
}
