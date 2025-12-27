'use client'

interface SidebarToggleProps {
  onToggle: () => void
  className?: string
}

export function SidebarToggle({
  onToggle,
  className = '',
}: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 group cursor-pointer ${className}`}
      aria-label="Open menu"
    >
      {/* Menu icon (hamburger) */}
      <div className="flex flex-col gap-1.5 w-6 h-6 justify-center">
        <span className="block w-full h-0.5 bg-white transition-opacity group-hover:opacity-60" />
        <span className="block w-full h-0.5 bg-white transition-opacity group-hover:opacity-60" />
        <span className="block w-full h-0.5 bg-white transition-opacity group-hover:opacity-60" />
      </div>

      {/* Artist name */}
      <span className="text-xl font-light text-white transition-opacity group-hover:opacity-60">
        Marcella Vlahos
      </span>
    </button>
  )
}
