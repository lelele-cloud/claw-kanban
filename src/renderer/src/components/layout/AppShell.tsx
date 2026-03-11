import { useEffect } from 'react'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { KanbanBoard } from '../kanban/KanbanBoard'
import { JsonView } from '../editors/JsonView'
import { ConfigPanel } from '../editors/ConfigPanel'
import { SetupWizard } from '../wizard/SetupWizard'
import { useUiStore } from '@/stores/uiStore'
import { useConfigStore } from '@/stores/configStore'

export function AppShell(): JSX.Element {
  const viewMode = useUiStore((s) => s.viewMode)
  const panelOpen = useUiStore((s) => s.panelOpen)
  const showWizard = useUiStore((s) => s.showWizard)
  const { loadConfig, loadSoulMd, loadSkills, config } = useConfigStore()

  useEffect(() => {
    loadConfig()
    loadSoulMd()
    loadSkills()

    const cleanup = window.api.onConfigChanged(() => {
      loadConfig()
    })

    return cleanup
  }, [loadConfig, loadSoulMd, loadSkills])

  // First-run detection: show wizard if config is empty
  useEffect(() => {
    if (!config) return
    const isEmptyConfig = Object.keys(config).length === 0
    const wizardDismissed = localStorage.getItem('wizard-dismissed')
    if (isEmptyConfig && !wizardDismissed) {
      showWizard()
    }
  }, [config, showWizard])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {viewMode === 'kanban' ? <KanbanBoard /> : <JsonView />}
        </main>
        {panelOpen && <ConfigPanel />}
      </div>
      <SetupWizard />
    </div>
  )
}
