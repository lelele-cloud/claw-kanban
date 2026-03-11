import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { cronSchema } from '@/lib/schemas'
import { FormField, TextInput, SwitchInput, SaveButton } from '../common/FormField'
import { Plus, Trash2 } from 'lucide-react'
import type { CronConfig } from '@/types/config'

export function CronForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [cron, setCron] = useState<CronConfig>({})
  const { hasErrors } = useValidation(cronSchema, cron)

  useEffect(() => {
    setCron(config.cron || {})
  }, [config.cron])

  const addJob = (): void => {
    setCron({
      ...cron,
      enabled: true,
      jobs: [...(cron.jobs || []), { schedule: '0 * * * *', command: '' }]
    })
  }

  const updateJob = (idx: number, key: string, value: string): void => {
    const jobs = [...(cron.jobs || [])]
    jobs[idx] = { ...jobs[idx], [key]: value }
    setCron({ ...cron, jobs })
  }

  const removeJob = (idx: number): void => {
    const jobs = [...(cron.jobs || [])]
    jobs.splice(idx, 1)
    setCron({ ...cron, jobs })
  }

  const save = async (): Promise<void> => {
    await patchConfig('cron', cron)
  }

  return (
    <div className="space-y-4">
      <FormField label="Cron Enabled" helpKey="cron.enabled">
        <SwitchInput
          checked={cron.enabled ?? false}
          onChange={(v) => setCron({ ...cron, enabled: v })}
        />
      </FormField>

      {(cron.jobs || []).map((job, idx) => (
        <div key={idx} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Job #{idx + 1}</span>
            <button onClick={() => removeJob(idx)} className="text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <FormField label="Schedule (cron expression)" helpKey="cron.jobs.schedule">
            <TextInput value={job.schedule} onChange={(v) => updateJob(idx, 'schedule', v)} placeholder="0 2 * * *" />
          </FormField>
          <FormField label="Command" helpKey="cron.jobs.command">
            <TextInput value={job.command} onChange={(v) => updateJob(idx, 'command', v)} placeholder="cleanup" />
          </FormField>
          <FormField label="Agent ID">
            <TextInput value={job.agentId || ''} onChange={(v) => updateJob(idx, 'agentId', v)} placeholder="main" />
          </FormField>
        </div>
      ))}

      <button
        onClick={addJob}
        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
      >
        <Plus className="h-3 w-3" />
        Add Job
      </button>

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
