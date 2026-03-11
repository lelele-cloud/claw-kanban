import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import type { ConfigStatus } from '@/types/kanban'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: ConfigStatus
}

const statusConfig: Record<ConfigStatus, { icon: typeof CheckCircle2; label: string; className: string }> = {
  configured: {
    icon: CheckCircle2,
    label: 'Configured',
    className: 'text-green-500'
  },
  unconfigured: {
    icon: Circle,
    label: 'Not configured',
    className: 'text-muted-foreground'
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    className: 'text-destructive'
  }
}

export function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn('flex items-center gap-1', config.className)}>
      <Icon className="h-3 w-3" />
      <span className="text-[10px]">{config.label}</span>
    </div>
  )
}
