import { Loader2, CheckCircle2, XCircle, Wifi } from 'lucide-react'
import { useConnectionTest, type ConnectionStatus } from '@/hooks/useConnectionTest'
import { cn } from '@/lib/utils'

interface TestConnectionButtonProps {
  type: string
  config: Record<string, unknown>
  label?: string
  className?: string
}

const statusIcons: Record<ConnectionStatus, typeof Wifi> = {
  idle: Wifi,
  testing: Loader2,
  success: CheckCircle2,
  error: XCircle
}

const statusColors: Record<ConnectionStatus, string> = {
  idle: 'text-muted-foreground hover:text-foreground border-border hover:border-foreground/30',
  testing: 'text-primary border-primary/30',
  success: 'text-green-500 border-green-500/30 bg-green-500/5',
  error: 'text-destructive border-destructive/30 bg-destructive/5'
}

export function TestConnectionButton({
  type,
  config,
  label = '测试连接',
  className
}: TestConnectionButtonProps): JSX.Element {
  const { status, message, latency, test } = useConnectionTest()

  const Icon = statusIcons[status]
  const isTestable = type === 'ollama' || Object.values(config).some((v) => typeof v === 'string' && v.length > 0)

  return (
    <div className={cn('space-y-1', className)}>
      <button
        onClick={() => test(type, config)}
        disabled={status === 'testing' || !isTestable}
        className={cn(
          'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-all disabled:opacity-50',
          statusColors[status]
        )}
      >
        <Icon className={cn('h-3 w-3', status === 'testing' && 'animate-spin')} />
        {status === 'testing'
          ? '测试中...'
          : status === 'success'
            ? `连接成功${latency ? ` (${latency}ms)` : ''}`
            : status === 'error'
              ? '连接失败'
              : label}
      </button>
      {message && status !== 'idle' && (
        <p
          className={cn(
            'text-[10px] pl-1',
            status === 'success' ? 'text-green-600' : status === 'error' ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {message}
        </p>
      )}
    </div>
  )
}
