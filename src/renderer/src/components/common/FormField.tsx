import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, description, children, className }: FormFieldProps): JSX.Element {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-medium">{label}</label>
      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      {children}
    </div>
  )
}

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}

export function TextInput({ value, onChange, placeholder, type = 'text' }: TextInputProps): JSX.Element {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
    />
  )
}

interface SelectInputProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}

export function SelectInput({ value, onChange, options }: SelectInputProps): JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

interface NumberInputProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  placeholder?: string
  min?: number
  max?: number
}

export function NumberInput({ value, onChange, placeholder, min, max }: NumberInputProps): JSX.Element {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      placeholder={placeholder}
      min={min}
      max={max}
      className="h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
    />
  )
}

interface SwitchInputProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchInput({ checked, onChange }: SwitchInputProps): JSX.Element {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm',
          checked && 'translate-x-4'
        )}
      />
    </button>
  )
}

interface SaveButtonProps {
  onClick: () => void
  saving?: boolean
}

export function SaveButton({ onClick, saving }: SaveButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {saving ? 'Saving...' : 'Save Configuration'}
    </button>
  )
}
