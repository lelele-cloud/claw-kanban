import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SelectInput, SaveButton } from '../common/FormField'
import { Plus, Trash2 } from 'lucide-react'

export function SecretsForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [secrets, setSecrets] = useState<Record<string, { type: string; allowList?: string[]; path?: string; command?: string }>>({})
  const [env, setEnv] = useState<Record<string, string>>({})
  const [newSecretName, setNewSecretName] = useState('')
  const [newEnvKey, setNewEnvKey] = useState('')
  const [newEnvVal, setNewEnvVal] = useState('')

  useEffect(() => {
    setSecrets((config.secrets as typeof secrets) || {})
    setEnv(config.env || {})
  }, [config])

  const addSecret = (): void => {
    if (!newSecretName.trim()) return
    setSecrets({ ...secrets, [newSecretName.trim()]: { type: 'env' } })
    setNewSecretName('')
  }

  const removeSecret = (name: string): void => {
    const updated = { ...secrets }
    delete updated[name]
    setSecrets(updated)
  }

  const addEnvVar = (): void => {
    if (!newEnvKey.trim()) return
    setEnv({ ...env, [newEnvKey.trim()]: newEnvVal })
    setNewEnvKey('')
    setNewEnvVal('')
  }

  const removeEnvVar = (key: string): void => {
    const updated = { ...env }
    delete updated[key]
    setEnv(updated)
  }

  const save = async (): Promise<void> => {
    if (Object.keys(secrets).length > 0) await patchConfig('secrets', secrets)
    if (Object.keys(env).length > 0) await patchConfig('env', env)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secret Providers</h3>

      {Object.entries(secrets).map(([name, secret]) => (
        <div key={name} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{name}</span>
            <button onClick={() => removeSecret(name)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <FormField label="Type">
            <SelectInput
              value={secret.type}
              onChange={(v) => setSecrets({ ...secrets, [name]: { ...secret, type: v } })}
              options={[
                { value: 'env', label: 'Environment' },
                { value: 'file', label: 'File' },
                { value: 'exec', label: 'Exec command' }
              ]}
            />
          </FormField>
          {secret.type === 'env' && (
            <FormField label="Allow List" description="Comma-separated env var names">
              <TextInput
                value={(secret.allowList || []).join(', ')}
                onChange={(v) => setSecrets({ ...secrets, [name]: { ...secret, allowList: v.split(',').map(s => s.trim()).filter(Boolean) } })}
                placeholder="OPENAI_API_KEY, ANTHROPIC_API_KEY"
              />
            </FormField>
          )}
          {secret.type === 'file' && (
            <FormField label="File Path">
              <TextInput value={secret.path || ''} onChange={(v) => setSecrets({ ...secrets, [name]: { ...secret, path: v } })} placeholder="/etc/secrets" />
            </FormField>
          )}
          {secret.type === 'exec' && (
            <FormField label="Command">
              <TextInput value={secret.command || ''} onChange={(v) => setSecrets({ ...secrets, [name]: { ...secret, command: v } })} placeholder="/usr/local/bin/vault-fetch" />
            </FormField>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <TextInput value={newSecretName} onChange={setNewSecretName} placeholder="Provider name" />
        <button onClick={addSecret} disabled={!newSecretName.trim()} className="flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-muted disabled:opacity-50 whitespace-nowrap">
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      <div className="my-3 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Environment Variables</h3>

      {Object.entries(env).map(([key, val]) => (
        <div key={key} className="flex items-center gap-2">
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{key}</code>
          <span className="text-xs text-muted-foreground">=</span>
          <span className="text-xs flex-1 truncate">{val}</span>
          <button onClick={() => removeEnvVar(key)} className="text-destructive"><Trash2 className="h-3 w-3" /></button>
        </div>
      ))}

      <div className="flex gap-2">
        <TextInput value={newEnvKey} onChange={setNewEnvKey} placeholder="KEY" />
        <TextInput value={newEnvVal} onChange={setNewEnvVal} placeholder="value" />
        <button onClick={addEnvVar} disabled={!newEnvKey.trim()} className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50 whitespace-nowrap">
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <SaveButton onClick={save} />
    </div>
  )
}
