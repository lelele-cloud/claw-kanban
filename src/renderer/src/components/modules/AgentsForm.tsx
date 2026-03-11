import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { agentsSchema } from '@/lib/schemas'
import { FormField, TextInput, NumberInput, SaveButton } from '../common/FormField'
import { Plus, Trash2 } from 'lucide-react'
import type { AgentsConfig, AgentEntry } from '@/types/config'

export function AgentsForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [agents, setAgents] = useState<AgentsConfig>({})
  const { getError, hasErrors } = useValidation(agentsSchema, agents)

  useEffect(() => {
    setAgents(config.agents || {})
  }, [config.agents])

  const updateDefaults = (key: string, value: unknown): void => {
    setAgents({
      ...agents,
      defaults: { ...agents.defaults, [key]: value }
    })
  }

  const addAgent = (): void => {
    const list = agents.list || []
    setAgents({
      ...agents,
      list: [...list, { id: `agent-${list.length + 1}` }]
    })
  }

  const updateAgent = (idx: number, updates: Partial<AgentEntry>): void => {
    const list = [...(agents.list || [])]
    list[idx] = { ...list[idx], ...updates }
    setAgents({ ...agents, list })
  }

  const removeAgent = (idx: number): void => {
    const list = [...(agents.list || [])]
    list.splice(idx, 1)
    setAgents({ ...agents, list })
  }

  const save = async (): Promise<void> => {
    await patchConfig('agents', agents)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Default Settings
      </h3>

      <FormField label="Workspace" description="Default agent workspace directory" helpKey="agents.defaults.workspace">
        <TextInput
          value={agents.defaults?.workspace || ''}
          onChange={(v) => updateDefaults('workspace', v)}
          placeholder="~/.openclaw/agents/main"
        />
      </FormField>

      <FormField label="Model" description="Default AI model" helpKey="agents.defaults.model">
        <TextInput
          value={agents.defaults?.model || ''}
          onChange={(v) => updateDefaults('model', v)}
          placeholder="claude-opus-4-6"
        />
      </FormField>

      <FormField label="Timeout" helpKey="agents.defaults.timeout" error={getError('defaults.timeout')}>
        <TextInput
          value={agents.defaults?.timeout || ''}
          onChange={(v) => updateDefaults('timeout', v)}
          placeholder="30m"
          error={!!getError('defaults.timeout')}
        />
      </FormField>

      <FormField label="Context Window" helpKey="agents.defaults.contextWindow">
        <NumberInput
          value={agents.defaults?.contextWindow}
          onChange={(v) => updateDefaults('contextWindow', v)}
          placeholder="200000"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Primary Concurrency" helpKey="agents.defaults.concurrencyLimits.primary">
          <NumberInput
            value={agents.defaults?.concurrencyLimits?.primary}
            onChange={(v) =>
              updateDefaults('concurrencyLimits', {
                ...agents.defaults?.concurrencyLimits,
                primary: v
              })
            }
            placeholder="4"
          />
        </FormField>
        <FormField label="Subagent Concurrency" helpKey="agents.defaults.concurrencyLimits.subagents">
          <NumberInput
            value={agents.defaults?.concurrencyLimits?.subagents}
            onChange={(v) =>
              updateDefaults('concurrencyLimits', {
                ...agents.defaults?.concurrencyLimits,
                subagents: v
              })
            }
            placeholder="8"
          />
        </FormField>
      </div>

      <div className="my-3 h-px bg-border" />

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Agent List
        </h3>
        <button
          onClick={addAgent}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
        >
          <Plus className="h-3 w-3" />
          Add Agent
        </button>
      </div>

      {(agents.list || []).map((agent, idx) => (
        <div key={idx} className="rounded-lg border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <FormField label="Agent ID" className="flex-1" helpKey="agents.list.id">
              <TextInput
                value={agent.id}
                onChange={(v) => updateAgent(idx, { id: v })}
                placeholder="agent-id"
              />
            </FormField>
            <button
              onClick={() => removeAgent(idx)}
              className="text-destructive hover:text-destructive/80 ml-2 mt-5"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <FormField label="Workspace">
            <TextInput
              value={agent.workspace || ''}
              onChange={(v) => updateAgent(idx, { workspace: v })}
              placeholder="Override workspace path"
            />
          </FormField>

          <FormField label="Model">
            <TextInput
              value={agent.model || ''}
              onChange={(v) => updateAgent(idx, { model: v })}
              placeholder="Override model"
            />
          </FormField>
        </div>
      ))}

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
