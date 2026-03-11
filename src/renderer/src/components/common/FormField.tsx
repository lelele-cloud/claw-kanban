import { HelpCircle } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'
import { getFieldHelp } from '@/lib/fieldHelp'

interface FormFieldProps {
  label: string
  description?: string
  error?: string
  helpKey?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, description, error, helpKey, children, className }: FormFieldProps): JSX.Element {
  const help = helpKey ? getFieldHelp(helpKey) : undefined

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center gap-1">
        <label className="text-xs font-medium">{label}</label>
        {help && (
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                  <HelpCircle className="h-3 w-3" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 max-w-xs rounded-md bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md border"
                  sideOffset={5}
                >
                  <p className="font-medium">{help.description}</p>
                  {help.tip && <p className="mt-1 text-muted-foreground">{help.tip}</p>}
                  <Tooltip.Arrow className="fill-popover" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
      </div>
      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      {children}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  )
}

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  error?: boolean
}

export function TextInput({ value, onChange, placeholder, type = 'text', error }: TextInputProps): JSX.Element {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring',
        error && 'border-destructive focus:ring-destructive'
      )}
    />
  )
}

interface SelectInputProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  error?: boolean
}

export function SelectInput({ value, onChange, options, error }: SelectInputProps): JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring',
        error && 'border-destructive focus:ring-destructive'
      )}
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
  error?: boolean
}

export function NumberInput({ value, onChange, placeholder, min, max, error }: NumberInputProps): JSX.Element {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      placeholder={placeholder}
      min={min}
      max={max}
      className={cn(
        'h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring',
        error && 'border-destructive focus:ring-destructive'
      )}
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
  disabled?: boolean
}

export function SaveButton({ onClick, saving, disabled }: SaveButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={saving || disabled}
      className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {saving ? '保存中...' : '保存配置'}
    </button>
  )
}
