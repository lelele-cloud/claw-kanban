import { kanbanColumns } from '@/lib/kanbanConfig'
import { KanbanColumn } from './KanbanColumn'
import { useConfigStore } from '@/stores/configStore'
import { Loader2 } from 'lucide-react'

export function KanbanBoard(): JSX.Element {
  const { loading, error } = useConfigStore()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading configuration...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium">Error loading configuration</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 p-4 h-full overflow-x-auto">
      {kanbanColumns.map((column) => (
        <KanbanColumn key={column.id} column={column} />
      ))}
    </div>
  )
}
