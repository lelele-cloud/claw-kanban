import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SaveButton } from '../common/FormField'
import { Plus, Trash2 } from 'lucide-react'
import type { BindingsConfig } from '@/types/config'

export function BindingsForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [bindings, setBindings] = useState<BindingsConfig>({})

  useEffect(() => {
    setBindings(config.bindings || {})
  }, [config.bindings])

  const addRoute = (): void => {
    setBindings({
      ...bindings,
      routes: [...(bindings.routes || []), { channel: '', agent: '' }]
    })
  }

  const updateRoute = (idx: number, key: string, value: string): void => {
    const routes = [...(bindings.routes || [])]
    routes[idx] = { ...routes[idx], [key]: value }
    setBindings({ ...bindings, routes })
  }

  const removeRoute = (idx: number): void => {
    const routes = [...(bindings.routes || [])]
    routes.splice(idx, 1)
    setBindings({ ...bindings, routes })
  }

  const save = async (): Promise<void> => {
    await patchConfig('bindings', bindings)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Route messages to different agents based on channel</p>

      {(bindings.routes || []).map((route, idx) => (
        <div key={idx} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Route #{idx + 1}</span>
            <button onClick={() => removeRoute(idx)} className="text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <FormField label="Channel">
            <TextInput value={route.channel} onChange={(v) => updateRoute(idx, 'channel', v)} placeholder="discord, telegram, *" />
          </FormField>
          <FormField label="Guild ID (optional)">
            <TextInput value={route.guildId || ''} onChange={(v) => updateRoute(idx, 'guildId', v)} placeholder="123456789" />
          </FormField>
          <FormField label="Target Agent">
            <TextInput value={route.agent} onChange={(v) => updateRoute(idx, 'agent', v)} placeholder="agent-id" />
          </FormField>
        </div>
      ))}

      <button onClick={addRoute} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
        <Plus className="h-3 w-3" />
        Add Route
      </button>

      <SaveButton onClick={save} />
    </div>
  )
}
