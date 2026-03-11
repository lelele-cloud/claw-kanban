import type { KanbanCardDef } from '@/types/kanban'
import { StatusBadge } from './StatusBadge'
import { useConfigStore } from '@/stores/configStore'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  card: KanbanCardDef
}

export function KanbanCard({ card }: KanbanCardProps): JSX.Element {
  const config = useConfigStore((s) => s.config)
  const { selectedCard, openPanel } = useUiStore()

  const rawConfig = config as Record<string, unknown>
  const status = card.getStatus(rawConfig)
  const summary = card.getSummary(rawConfig)
  const isSelected = selectedCard === card.id
  const Icon = card.icon

  return (
    <button
      onClick={() => openPanel(card.id)}
      className={cn(
        'w-full text-left rounded-lg border bg-card p-3 transition-all hover:shadow-md hover:border-primary/50',
        isSelected && 'ring-2 ring-primary border-primary'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md',
            status === 'configured' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium leading-tight">{card.title}</h3>
            <p className="text-[11px] text-muted-foreground">{card.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground truncate max-w-[160px]">{summary}</span>
        <StatusBadge status={status} />
      </div>
    </button>
  )
}
