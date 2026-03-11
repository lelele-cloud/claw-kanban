import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { memorySearchSchema } from '@/lib/schemas'
import { FormField, SelectInput, NumberInput, SwitchInput, SaveButton } from '../common/FormField'
import type { MemorySearchConfig } from '@/types/config'

export function MemoryForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [memory, setMemory] = useState<MemorySearchConfig>({})
  const { hasErrors } = useValidation(memorySearchSchema, memory)

  useEffect(() => {
    setMemory(config.agents?.defaults?.memorySearch || {})
  }, [config])

  const save = async (): Promise<void> => {
    await patchConfig('agents.defaults.memorySearch', memory)
  }

  return (
    <div className="space-y-4">
      <FormField label="Memory Search Enabled" helpKey="memorySearch.enabled">
        <SwitchInput
          checked={memory.enabled ?? false}
          onChange={(v) => setMemory({ ...memory, enabled: v })}
        />
      </FormField>

      {memory.enabled && (
        <>
          <FormField label="Provider" description="Embedding provider for vector search" helpKey="memorySearch.provider">
            <SelectInput
              value={memory.provider || ''}
              onChange={(v) => setMemory({ ...memory, provider: v as MemorySearchConfig['provider'] })}
              options={[
                { value: '', label: 'Auto-detect' },
                { value: 'openai', label: 'OpenAI' },
                { value: 'gemini', label: 'Google Gemini' },
                { value: 'voyage', label: 'Voyage' },
                { value: 'mistral', label: 'Mistral' },
                { value: 'local', label: 'Local' }
              ]}
            />
          </FormField>

          <div className="my-2 h-px bg-border" />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sync Settings</h3>

          <FormField label="Delta Bytes" description="Bytes threshold before sync" helpKey="memorySearch.sync.sessions.deltaBytes">
            <NumberInput
              value={memory.sync?.sessions?.deltaBytes}
              onChange={(v) => setMemory({ ...memory, sync: { sessions: { ...memory.sync?.sessions, deltaBytes: v } } })}
              placeholder="100000"
            />
          </FormField>

          <FormField label="Delta Messages" description="Message count threshold before sync" helpKey="memorySearch.sync.sessions.deltaMessages">
            <NumberInput
              value={memory.sync?.sessions?.deltaMessages}
              onChange={(v) => setMemory({ ...memory, sync: { sessions: { ...memory.sync?.sessions, deltaMessages: v } } })}
              placeholder="50"
            />
          </FormField>
        </>
      )}

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
