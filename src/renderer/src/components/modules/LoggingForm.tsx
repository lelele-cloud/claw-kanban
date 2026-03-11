import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { loggingSchema } from '@/lib/schemas'
import { FormField, TextInput, SelectInput, SwitchInput, SaveButton } from '../common/FormField'
import type { LoggingConfig } from '@/types/config'

export function LoggingForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [logging, setLogging] = useState<LoggingConfig>({})
  const { hasErrors } = useValidation(loggingSchema, logging)

  useEffect(() => {
    setLogging(config.logging || {})
  }, [config.logging])

  const save = async (): Promise<void> => {
    await patchConfig('logging', logging)
  }

  return (
    <div className="space-y-4">
      <FormField label="Log Level" helpKey="logging.level">
        <SelectInput
          value={logging.level || 'info'}
          onChange={(v) => setLogging({ ...logging, level: v as LoggingConfig['level'] })}
          options={[
            { value: 'debug', label: 'Debug' },
            { value: 'info', label: 'Info' },
            { value: 'warn', label: 'Warn' },
            { value: 'error', label: 'Error' }
          ]}
        />
      </FormField>

      <FormField label="Log File Path" helpKey="logging.file">
        <TextInput
          value={logging.file || ''}
          onChange={(v) => setLogging({ ...logging, file: v })}
          placeholder="~/.openclaw/logs/openclaw.log"
        />
      </FormField>

      <FormField label="Redaction Enabled" helpKey="logging.redact.enabled">
        <SwitchInput
          checked={logging.redact?.enabled ?? true}
          onChange={(v) => setLogging({ ...logging, redact: { ...logging.redact, enabled: v } })}
        />
      </FormField>

      <FormField label="Redact Patterns" description="Comma-separated patterns">
        <TextInput
          value={(logging.redact?.patterns || []).join(', ')}
          onChange={(v) => setLogging({ ...logging, redact: { ...logging.redact, patterns: v.split(',').map(s => s.trim()).filter(Boolean) } })}
          placeholder="api-key, token, password"
        />
      </FormField>

      <FormField label="Console Colors">
        <SwitchInput
          checked={logging.console?.colors ?? true}
          onChange={(v) => setLogging({ ...logging, console: { ...logging.console, colors: v } })}
        />
      </FormField>

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
