import { Search, LayoutGrid, Code2 } from 'lucide-react'
import { useUiStore } from '@/stores/uiStore'
import { useConfigStore } from '@/stores/configStore'
import { cn } from '@/lib/utils'

export function TitleBar(): JSX.Element {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useUiStore()
  const configPath = useConfigStore((s) => s.configPath)

  return (
    <div className="drag-region flex h-12 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4">
      <div className="flex items-center gap-3 no-drag">
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">CK</span>
          </div>
          <span className="font-semibold text-sm">Claw Kanban</span>
        </div>
        {configPath && (
          <span className="text-xs text-muted-foreground max-w-[300px] truncate">
            {configPath}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 no-drag">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search configs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 w-48 rounded-md border bg-muted/50 pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex rounded-md border overflow-hidden">
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-xs transition-colors',
              viewMode === 'kanban'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-xs transition-colors',
              viewMode === 'json'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            JSON
          </button>
        </div>
      </div>
    </div>
  )
}
