import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { sandboxSchema } from '@/lib/schemas'
import { FormField, SelectInput, TextInput, SwitchInput, SaveButton } from '../common/FormField'
import type { SandboxConfig } from '@/types/config'

export function SandboxForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [sandbox, setSandbox] = useState<SandboxConfig>({})
  const { hasErrors } = useValidation(sandboxSchema, sandbox)

  useEffect(() => {
    const agentSandbox = config.agents?.defaults?.sandbox
    setSandbox(config.sandbox || agentSandbox || {})
  }, [config])

  const save = async (): Promise<void> => {
    await patchConfig('agents.defaults.sandbox', sandbox)
  }

  return (
    <div className="space-y-4">
      <FormField label="Sandbox Enabled">
        <SwitchInput
          checked={sandbox.enabled ?? false}
          onChange={(v) => setSandbox({ ...sandbox, enabled: v })}
        />
      </FormField>

      <FormField label="Mode" description="Which agent sessions to sandbox" helpKey="sandbox.mode">
        <SelectInput
          value={sandbox.mode || 'off'}
          onChange={(v) => setSandbox({ ...sandbox, mode: v as SandboxConfig['mode'] })}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'non-main', label: 'Non-main agents only' },
            { value: 'all', label: 'All agents' }
          ]}
        />
      </FormField>

      {sandbox.mode !== 'off' && (
        <>
          <div className="my-2 h-px bg-border" />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Docker Settings</h3>

          <FormField label="Network" helpKey="sandbox.docker.network">
            <SelectInput
              value={sandbox.docker?.network || 'none'}
              onChange={(v) => setSandbox({ ...sandbox, docker: { ...sandbox.docker, network: v as 'none' | 'bridge' | 'host' } })}
              options={[
                { value: 'none', label: 'None (isolated)' },
                { value: 'bridge', label: 'Bridge' },
                { value: 'host', label: 'Host' }
              ]}
            />
          </FormField>

          <FormField label="Workspace Access" helpKey="sandbox.docker.workspaceAccess">
            <SelectInput
              value={sandbox.docker?.workspaceAccess || 'read'}
              onChange={(v) => setSandbox({ ...sandbox, docker: { ...sandbox.docker, workspaceAccess: v as 'full' | 'read' | 'none' } })}
              options={[
                { value: 'none', label: 'None' },
                { value: 'read', label: 'Read only' },
                { value: 'full', label: 'Full access' }
              ]}
            />
          </FormField>

          <FormField label="Memory Limit" helpKey="sandbox.docker.resourceLimits.memory">
            <TextInput
              value={sandbox.docker?.resourceLimits?.memory || ''}
              onChange={(v) => setSandbox({ ...sandbox, docker: { ...sandbox.docker, resourceLimits: { ...sandbox.docker?.resourceLimits, memory: v } } })}
              placeholder="512m"
            />
          </FormField>

          <FormField label="CPU Limit" helpKey="sandbox.docker.resourceLimits.cpus">
            <TextInput
              value={sandbox.docker?.resourceLimits?.cpus || ''}
              onChange={(v) => setSandbox({ ...sandbox, docker: { ...sandbox.docker, resourceLimits: { ...sandbox.docker?.resourceLimits, cpus: v } } })}
              placeholder="1.0"
            />
          </FormField>
        </>
      )}

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
