import {
  LayoutGrid,
  Code2,
  FolderOpen,
  RefreshCw,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import { useUiStore } from '@/stores/uiStore'
import { useConfigStore } from '@/stores/configStore'
import { cn } from '@/lib/utils'

export function Sidebar(): JSX.Element {
  const { viewMode, setViewMode, showWizard } = useUiStore()
  const { loadConfig, loading } = useConfigStore()

  return (
    <div className="flex h-full w-12 flex-col items-center border-r bg-muted/30 py-3 gap-1">
      <button
        onClick={() => setViewMode('kanban')}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-md transition-colors',
          viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
        )}
        title="Kanban View"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>

      <button
        onClick={() => setViewMode('json')}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-md transition-colors',
          viewMode === 'json' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
        )}
        title="JSON Editor"
      >
        <Code2 className="h-4 w-4" />
      </button>

      <div className="my-2 h-px w-6 bg-border" />

      <button
        onClick={() => loadConfig()}
        disabled={loading}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Reload Config"
      >
        <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
      </button>

      <button
        onClick={() => window.api.system.openClawDir().then((d) => window.api.system.openInEditor(d))}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Open Config Directory"
      >
        <FolderOpen className="h-4 w-4" />
      </button>

      <div className="flex-1" />

      <button
        onClick={() => window.api.system.openExternal('https://github.com/openclaw/openclaw')}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="OpenClaw Docs"
      >
        <ExternalLink className="h-4 w-4" />
      </button>

      <button
        onClick={() => showWizard()}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="设置向导"
      >
        <Sparkles className="h-4 w-4" />
      </button>
    </div>
  )
}
