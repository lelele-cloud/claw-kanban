import type { KanbanColumnDef } from '@/types/kanban'
import { KanbanCard } from './KanbanCard'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  column: KanbanColumnDef
}

export function KanbanColumn({ column }: KanbanColumnProps): JSX.Element {
  const searchQuery = useUiStore((s) => s.searchQuery)

  const filteredCards = searchQuery
    ? column.cards.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.configKey.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : column.cards

  if (searchQuery && filteredCards.length === 0) {
    return <></>
  }

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn('h-2 w-2 rounded-full', column.color)} />
        <h2 className="text-sm font-semibold">{column.title}</h2>
        <span className="text-xs text-muted-foreground">
          {filteredCards.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        {filteredCards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
