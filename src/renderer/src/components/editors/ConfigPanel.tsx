import { X } from 'lucide-react'
import { useUiStore } from '@/stores/uiStore'
import { findCard } from '@/lib/kanbanConfig'
import { GatewayForm } from '../modules/GatewayForm'
import { ModelsForm } from '../modules/ModelsForm'
import { AgentsForm } from '../modules/AgentsForm'
import { ChannelsForm } from '../modules/ChannelsForm'
import { SessionForm } from '../modules/SessionForm'
import { ToolsForm } from '../modules/ToolsForm'
import { SkillsForm } from '../modules/SkillsForm'
import { SoulMdEditor } from '../modules/SoulMdEditor'
import { SandboxForm } from '../modules/SandboxForm'
import { CronForm } from '../modules/CronForm'
import { HooksForm } from '../modules/HooksForm'
import { BindingsForm } from '../modules/BindingsForm'
import { MessagesForm } from '../modules/MessagesForm'
import { LoggingForm } from '../modules/LoggingForm'
import { BrowserForm } from '../modules/BrowserForm'
import { SecretsForm } from '../modules/SecretsForm'
import { DiscoveryForm } from '../modules/DiscoveryForm'
import { UiIdentityForm } from '../modules/UiIdentityForm'
import { MemoryForm } from '../modules/MemoryForm'
import { PluginsForm } from '../modules/PluginsForm'

const formMap: Record<string, () => JSX.Element> = {
  gateway: GatewayForm,
  models: ModelsForm,
  agents: AgentsForm,
  channels: ChannelsForm,
  session: SessionForm,
  tools: ToolsForm,
  skills: SkillsForm,
  'soul-md': SoulMdEditor,
  sandbox: SandboxForm,
  cron: CronForm,
  hooks: HooksForm,
  bindings: BindingsForm,
  messages: MessagesForm,
  logging: LoggingForm,
  browser: BrowserForm,
  secrets: SecretsForm,
  discovery: DiscoveryForm,
  'ui-identity': UiIdentityForm,
  memory: MemoryForm,
  plugins: PluginsForm
}

export function ConfigPanel(): JSX.Element {
  const { selectedCard, closePanel } = useUiStore()
  const card = selectedCard ? findCard(selectedCard) : null
  const FormComponent = selectedCard ? formMap[selectedCard] : null

  return (
    <div className="w-[480px] border-l bg-background flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {card && (
            <>
              <card.icon className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">{card.title}</h2>
            </>
          )}
        </div>
        <button
          onClick={closePanel}
          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {FormComponent ? (
          <FormComponent />
        ) : (
          <p className="text-sm text-muted-foreground">Select a configuration module</p>
        )}
      </div>
    </div>
  )
}
