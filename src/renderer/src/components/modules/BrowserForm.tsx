import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { browserSchema } from '@/lib/schemas'
import { FormField, TextInput, NumberInput, SwitchInput, SaveButton } from '../common/FormField'
import { Plus, Trash2 } from 'lucide-react'
import type { BrowserConfig } from '@/types/config'

export function BrowserForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [browser, setBrowser] = useState<BrowserConfig>({})
  const [newProfileName, setNewProfileName] = useState('')
  const { hasErrors } = useValidation(browserSchema, browser)

  useEffect(() => {
    setBrowser(config.browser || {})
  }, [config.browser])

  const addProfile = (): void => {
    if (!newProfileName.trim()) return
    setBrowser({
      ...browser,
      profiles: { ...browser.profiles, [newProfileName.trim()]: {} }
    })
    setNewProfileName('')
  }

  const removeProfile = (name: string): void => {
    const profiles = { ...browser.profiles }
    delete profiles[name]
    setBrowser({ ...browser, profiles })
  }

  const save = async (): Promise<void> => {
    await patchConfig('browser', browser)
  }

  return (
    <div className="space-y-4">
      <FormField label="Browser Automation Enabled" helpKey="browser.enabled">
        <SwitchInput
          checked={browser.enabled ?? false}
          onChange={(v) => setBrowser({ ...browser, enabled: v })}
        />
      </FormField>

      {browser.enabled && (
        <>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profiles</h3>

          {Object.entries(browser.profiles || {}).map(([name, profile]) => (
            <div key={name} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{name}</span>
                <button onClick={() => removeProfile(name)} className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <FormField label="Browser Path">
                <TextInput
                  value={profile.path || ''}
                  onChange={(v) => setBrowser({ ...browser, profiles: { ...browser.profiles, [name]: { ...profile, path: v } } })}
                  placeholder="/usr/bin/chromium"
                />
              </FormField>
              <FormField label="CDP Port">
                <NumberInput
                  value={profile.cdpPort}
                  onChange={(v) => setBrowser({ ...browser, profiles: { ...browser.profiles, [name]: { ...profile, cdpPort: v } } })}
                  placeholder="9222"
                />
              </FormField>
            </div>
          ))}

          <div className="flex gap-2">
            <TextInput value={newProfileName} onChange={setNewProfileName} placeholder="Profile name" />
            <button onClick={addProfile} disabled={!newProfileName.trim()} className="flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-muted disabled:opacity-50 whitespace-nowrap">
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>

          <FormField label="Block Private Networks" helpKey="browser.ssrfPolicy.blockPrivateNetworks">
            <SwitchInput
              checked={browser.ssrfPolicy?.blockPrivateNetworks ?? true}
              onChange={(v) => setBrowser({ ...browser, ssrfPolicy: { ...browser.ssrfPolicy, blockPrivateNetworks: v } })}
            />
          </FormField>
        </>
      )}

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
