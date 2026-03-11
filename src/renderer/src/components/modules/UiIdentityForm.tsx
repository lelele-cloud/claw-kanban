import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SelectInput, SaveButton } from '../common/FormField'

export function UiIdentityForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [colorScheme, setColorScheme] = useState<string>('auto')
  const [assistantName, setAssistantName] = useState('')
  const [user, setUser] = useState('')
  const [org, setOrg] = useState('')

  useEffect(() => {
    setColorScheme(config.ui?.colorScheme || 'auto')
    setAssistantName(config.ui?.assistantName || '')
    setUser(config.identity?.user || '')
    setOrg(config.identity?.org || '')
  }, [config])

  const save = async (): Promise<void> => {
    await patchConfig('ui', { colorScheme, assistantName: assistantName || undefined })
    await patchConfig('identity', { user: user || undefined, org: org || undefined })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">UI Settings</h3>

      <FormField label="Color Scheme">
        <SelectInput
          value={colorScheme}
          onChange={setColorScheme}
          options={[
            { value: 'auto', label: 'Auto (system)' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' }
          ]}
        />
      </FormField>

      <FormField label="Assistant Name">
        <TextInput value={assistantName} onChange={setAssistantName} placeholder="Claude" />
      </FormField>

      <div className="my-2 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identity</h3>

      <FormField label="User">
        <TextInput value={user} onChange={setUser} placeholder="Your Name" />
      </FormField>

      <FormField label="Organization">
        <TextInput value={org} onChange={setOrg} placeholder="Your Org" />
      </FormField>

      <SaveButton onClick={save} />
    </div>
  )
}
