interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export function FilterBar({ options, value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-1 p-0.5 bg-bg-elevated rounded-lg border border-border">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
            ${value === option.value
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
