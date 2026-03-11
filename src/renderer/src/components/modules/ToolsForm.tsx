import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SelectInput, SwitchInput, NumberInput, SaveButton } from '../common/FormField'
import type { ToolsConfig } from '@/types/config'

export function ToolsForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [tools, setTools] = useState<ToolsConfig>({})

  useEffect(() => {
    setTools(config.tools || {})
  }, [config.tools])

  const save = async (): Promise<void> => {
    await patchConfig('tools', tools)
  }

  return (
    <div className="space-y-4">
      <FormField label="Tool Profile" description="Pre-configured tool set">
        <SelectInput
          value={tools.profile || 'coding'}
          onChange={(v) => setTools({ ...tools, profile: v as ToolsConfig['profile'] })}
          options={[
            { value: 'minimal', label: 'Minimal' },
            { value: 'coding', label: 'Coding (default)' },
            { value: 'messaging', label: 'Messaging' },
            { value: 'full', label: 'Full' }
          ]}
        />
      </FormField>

      <FormField label="Allow" description="Comma-separated tool patterns (e.g. git.*, web.*)">
        <TextInput
          value={(tools.allow || []).join(', ')}
          onChange={(v) =>
            setTools({ ...tools, allow: v.split(',').map((s) => s.trim()).filter(Boolean) })
          }
          placeholder="git.*, web.*, bash"
        />
      </FormField>

      <FormField label="Deny" description="Blocked tool patterns">
        <TextInput
          value={(tools.deny || []).join(', ')}
          onChange={(v) =>
            setTools({ ...tools, deny: v.split(',').map((s) => s.trim()).filter(Boolean) })
          }
          placeholder="rm, exec"
        />
      </FormField>

      <div className="my-2 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Execution
      </h3>

      <FormField label="Exec Enabled">
        <SwitchInput
          checked={tools.exec?.enabled ?? true}
          onChange={(v) => setTools({ ...tools, exec: { ...tools.exec, enabled: v } })}
        />
      </FormField>

      <FormField label="Exec Timeout">
        <TextInput
          value={tools.exec?.timeout || ''}
          onChange={(v) => setTools({ ...tools, exec: { ...tools.exec, timeout: v } })}
          placeholder="30s"
        />
      </FormField>

      <div className="my-2 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Web Tools
      </h3>

      <FormField label="Web Search">
        <SwitchInput
          checked={tools.web?.search?.enabled ?? true}
          onChange={(v) =>
            setTools({
              ...tools,
              web: { ...tools.web, search: { ...tools.web?.search, enabled: v } }
            })
          }
        />
      </FormField>

      {tools.web?.search?.enabled && (
        <>
          <FormField label="Search Provider">
            <TextInput
              value={tools.web?.search?.provider || ''}
              onChange={(v) =>
                setTools({
                  ...tools,
                  web: { ...tools.web, search: { ...tools.web?.search, provider: v } }
                })
              }
              placeholder="brave"
            />
          </FormField>
        </>
      )}

      <FormField label="Web Fetch">
        <SwitchInput
          checked={tools.web?.fetch?.enabled ?? true}
          onChange={(v) =>
            setTools({
              ...tools,
              web: { ...tools.web, fetch: { ...tools.web?.fetch, enabled: v } }
            })
          }
        />
      </FormField>

      <FormField label="Max Fetch Bytes">
        <NumberInput
          value={tools.web?.fetch?.maxBytes}
          onChange={(v) =>
            setTools({
              ...tools,
              web: { ...tools.web, fetch: { ...tools.web?.fetch, maxBytes: v } }
            })
          }
          placeholder="10485760"
        />
      </FormField>

      <div className="my-2 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Media
      </h3>

      <FormField label="Image Model">
        <TextInput
          value={tools.media?.imageModel || ''}
          onChange={(v) => setTools({ ...tools, media: { ...tools.media, imageModel: v } })}
          placeholder="dall-e-3"
        />
      </FormField>

      <FormField label="Video Model">
        <TextInput
          value={tools.media?.videoModel || ''}
          onChange={(v) => setTools({ ...tools, media: { ...tools.media, videoModel: v } })}
          placeholder="gemini-2-flash"
        />
      </FormField>

      <SaveButton onClick={save} />
    </div>
  )
}
