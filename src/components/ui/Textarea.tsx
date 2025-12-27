import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`block w-full rounded-md border ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-black focus:ring-black'
          } px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
