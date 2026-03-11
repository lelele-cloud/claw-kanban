import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SelectInput, NumberInput, SwitchInput, SaveButton } from '../common/FormField'
import type { SessionConfig } from '@/types/config'

export function SessionForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [session, setSession] = useState<SessionConfig>({})

  useEffect(() => {
    setSession(config.session || {})
  }, [config.session])

  const save = async (): Promise<void> => {
    await patchConfig('session', session)
  }

  return (
    <div className="space-y-4">
      <FormField label="DM Scope" description="How DM conversations are scoped">
        <SelectInput
          value={session.dmScope || 'main'}
          onChange={(v) => setSession({ ...session, dmScope: v as SessionConfig['dmScope'] })}
          options={[
            { value: 'main', label: 'Main (single session)' },
            { value: 'per-peer', label: 'Per Peer' },
            { value: 'per-channel-peer', label: 'Per Channel+Peer' }
          ]}
        />
      </FormField>

      <FormField label="Reset Policy">
        <SelectInput
          value={session.reset?.policy || 'daily'}
          onChange={(v) =>
            setSession({ ...session, reset: { ...session.reset, policy: v as 'daily' | 'idle' } })
          }
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'idle', label: 'Idle' }
          ]}
        />
      </FormField>

      {session.reset?.policy === 'daily' && (
        <FormField label="Reset Time" description="Daily reset time (HH:MM)">
          <TextInput
            value={session.reset?.time || ''}
            onChange={(v) => setSession({ ...session, reset: { ...session.reset!, time: v } })}
            placeholder="04:00"
          />
        </FormField>
      )}

      {session.reset?.policy === 'idle' && (
        <FormField label="Idle Hours" description="Hours of inactivity before reset">
          <NumberInput
            value={session.reset?.idleHours}
            onChange={(v) => setSession({ ...session, reset: { ...session.reset!, idleHours: v } })}
            placeholder="24"
          />
        </FormField>
      )}

      <FormField label="Session Store Path">
        <TextInput
          value={session.store || ''}
          onChange={(v) => setSession({ ...session, store: v })}
          placeholder="~/.openclaw/sessions"
        />
      </FormField>

      <div className="my-2 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Thread Bindings
      </h3>

      <FormField label="Enabled">
        <SwitchInput
          checked={session.threadBindings?.enabled ?? true}
          onChange={(v) =>
            setSession({
              ...session,
              threadBindings: { ...session.threadBindings, enabled: v }
            })
          }
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Idle Hours">
          <NumberInput
            value={session.threadBindings?.idleHours}
            onChange={(v) =>
              setSession({
                ...session,
                threadBindings: { ...session.threadBindings, idleHours: v }
              })
            }
            placeholder="48"
          />
        </FormField>
        <FormField label="Max Age (hours)">
          <NumberInput
            value={session.threadBindings?.maxAgeHours}
            onChange={(v) =>
              setSession({
                ...session,
                threadBindings: { ...session.threadBindings, maxAgeHours: v }
              })
            }
            placeholder="720"
          />
        </FormField>
      </div>

      <div className="my-2 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Maintenance
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Retention (days)">
          <NumberInput
            value={session.maintenance?.retentionDays}
            onChange={(v) =>
              setSession({
                ...session,
                maintenance: { ...session.maintenance, retentionDays: v }
              })
            }
            placeholder="30"
          />
        </FormField>
        <FormField label="Disk Budget (MB)">
          <NumberInput
            value={session.maintenance?.diskBudgetMb}
            onChange={(v) =>
              setSession({
                ...session,
                maintenance: { ...session.maintenance, diskBudgetMb: v }
              })
            }
            placeholder="10000"
          />
        </FormField>
      </div>

      <SaveButton onClick={save} />
    </div>
  )
}
