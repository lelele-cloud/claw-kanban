import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SelectInput, SaveButton } from '../common/FormField'
import { Plus, Trash2 } from 'lucide-react'
import type { ProviderConfig } from '@/types/config'

export function ModelsForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [providers, setProviders] = useState<Record<string, ProviderConfig>>({})
  const [newName, setNewName] = useState('')

  useEffect(() => {
    setProviders(config.models?.providers || {})
  }, [config.models])

  const updateProvider = (name: string, updates: Partial<ProviderConfig>): void => {
    setProviders({
      ...providers,
      [name]: { ...providers[name], ...updates }
    })
  }

  const addProvider = (): void => {
    if (!newName.trim()) return
    setProviders({
      ...providers,
      [newName.trim()]: { baseUrl: '', apiType: 'openai' }
    })
    setNewName('')
  }

  const removeProvider = (name: string): void => {
    const updated = { ...providers }
    delete updated[name]
    setProviders(updated)
  }

  const save = async (): Promise<void> => {
    await patchConfig('models', { providers })
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Configure AI model providers (Anthropic, OpenAI, Google, Ollama, etc.)
      </p>

      {Object.entries(providers).map(([name, provider]) => (
        <div key={name} className="rounded-lg border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold">{name}</h3>
            <button
              onClick={() => removeProvider(name)}
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <FormField label="Base URL">
            <TextInput
              value={provider.baseUrl}
              onChange={(v) => updateProvider(name, { baseUrl: v })}
              placeholder="https://api.openai.com/v1"
            />
          </FormField>

          <FormField label="API Type">
            <SelectInput
              value={provider.apiType}
              onChange={(v) => updateProvider(name, { apiType: v })}
              options={[
                { value: 'anthropic', label: 'Anthropic' },
                { value: 'openai', label: 'OpenAI' },
                { value: 'google', label: 'Google' },
                { value: 'ollama', label: 'Ollama' },
                { value: 'deepseek', label: 'DeepSeek' },
                { value: 'mistral', label: 'Mistral' }
              ]}
            />
          </FormField>

          <FormField label="API Key">
            <TextInput
              value={typeof provider.apiKey === 'string' ? provider.apiKey : ''}
              onChange={(v) => updateProvider(name, { apiKey: v })}
              placeholder="${API_KEY} or actual key"
              type="password"
            />
          </FormField>
        </div>
      ))}

      <div className="flex gap-2">
        <TextInput
          value={newName}
          onChange={setNewName}
          placeholder="Provider name (e.g. openai)"
        />
        <button
          onClick={addProvider}
          className="flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-muted transition-colors whitespace-nowrap"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      <SaveButton onClick={save} />
    </div>
  )
}
