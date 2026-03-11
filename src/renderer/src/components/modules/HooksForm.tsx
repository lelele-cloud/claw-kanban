import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SaveButton } from '../common/FormField'
import { Plus, Trash2 } from 'lucide-react'
import type { HooksConfig } from '@/types/config'

export function HooksForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [hooks, setHooks] = useState<HooksConfig>({})
  const [newPath, setNewPath] = useState('')
  const [newAgent, setNewAgent] = useState('')

  useEffect(() => {
    setHooks(config.hooks || {})
  }, [config.hooks])

  const addMapping = (): void => {
    if (!newPath.trim() || !newAgent.trim()) return
    setHooks({
      ...hooks,
      mappings: { ...hooks.mappings, [newPath.trim()]: newAgent.trim() }
    })
    setNewPath('')
    setNewAgent('')
  }

  const removeMapping = (path: string): void => {
    const mappings = { ...hooks.mappings }
    delete mappings[path]
    setHooks({ ...hooks, mappings })
  }

  const save = async (): Promise<void> => {
    await patchConfig('hooks', hooks)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Map webhook paths to agents</p>

      {Object.entries(hooks.mappings || {}).map(([path, agent]) => (
        <div key={path} className="flex items-center gap-2 rounded-lg border p-2">
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded flex-1 truncate">{path}</code>
          <span className="text-xs text-muted-foreground">→</span>
          <span className="text-xs font-medium">{agent}</span>
          <button onClick={() => removeMapping(path)} className="text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <div className="space-y-2">
        <FormField label="Webhook Path">
          <TextInput value={newPath} onChange={setNewPath} placeholder="/webhook/github" />
        </FormField>
        <FormField label="Target Agent">
          <TextInput value={newAgent} onChange={setNewAgent} placeholder="engineering-agent" />
        </FormField>
        <button
          onClick={addMapping}
          disabled={!newPath.trim() || !newAgent.trim()}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50"
        >
          <Plus className="h-3 w-3" />
          Add Mapping
        </button>
      </div>

      <SaveButton onClick={save} />
    </div>
  )
}
