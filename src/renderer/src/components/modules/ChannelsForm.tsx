import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { channelsSchema } from '@/lib/schemas'
import { FormField, TextInput, SelectInput, SaveButton } from '../common/FormField'
import { TestConnectionButton } from '../common/TestConnectionButton'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import type { ChannelConfig } from '@/types/config'

const CHANNEL_TYPES = [
  'telegram', 'discord', 'slack', 'whatsapp', 'matrix', 'twilio', 'irc', 'signal'
]

export function ChannelsForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [channels, setChannels] = useState<Record<string, ChannelConfig>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newChannel, setNewChannel] = useState('')
  const { hasErrors } = useValidation(channelsSchema, channels)

  useEffect(() => {
    setChannels(config.channels || {})
  }, [config.channels])

  const updateChannel = (name: string, updates: Partial<ChannelConfig>): void => {
    setChannels({
      ...channels,
      [name]: { ...channels[name], ...updates }
    })
  }

  const addChannel = (): void => {
    if (!newChannel) return
    setChannels({ ...channels, [newChannel]: { dmPolicy: 'pairing' } })
    setExpanded(newChannel)
    setNewChannel('')
  }

  const removeChannel = (name: string): void => {
    const updated = { ...channels }
    delete updated[name]
    setChannels(updated)
    if (expanded === name) setExpanded(null)
  }

  const save = async (): Promise<void> => {
    await patchConfig('channels', channels)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Configure messaging platform integrations
      </p>

      {Object.entries(channels).map(([name, channel]) => (
        <div key={name} className="rounded-lg border overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === name ? null : name)}
            className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {expanded === name ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <span className="text-sm font-medium capitalize">{name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeChannel(name)
              }}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </button>

          {expanded === name && (
            <div className="border-t p-3 space-y-3">
              <FormField label="Bot Token / Token" helpKey="channels.botToken">
                <TextInput
                  value={
                    typeof channel.botToken === 'string'
                      ? channel.botToken
                      : typeof channel.token === 'string'
                        ? channel.token
                        : ''
                  }
                  onChange={(v) =>
                    updateChannel(name, name === 'telegram' ? { botToken: v } : { token: v })
                  }
                  placeholder="${BOT_TOKEN}"
                  type="password"
                />
              </FormField>

              <FormField label="DM Policy" helpKey="channels.dmPolicy">
                <SelectInput
                  value={channel.dmPolicy || 'pairing'}
                  onChange={(v) =>
                    updateChannel(name, { dmPolicy: v as ChannelConfig['dmPolicy'] })
                  }
                  options={[
                    { value: 'pairing', label: 'Pairing (default)' },
                    { value: 'allowlist', label: 'Allowlist' },
                    { value: 'open', label: 'Open' },
                    { value: 'disabled', label: 'Disabled' }
                  ]}
                />
              </FormField>

              <FormField label="Group Policy" helpKey="channels.groupPolicy">
                <SelectInput
                  value={channel.groupPolicy || 'allowlist'}
                  onChange={(v) =>
                    updateChannel(name, { groupPolicy: v as ChannelConfig['groupPolicy'] })
                  }
                  options={[
                    { value: 'allowlist', label: 'Allowlist (default)' },
                    { value: 'open', label: 'Open' },
                    { value: 'disabled', label: 'Disabled' }
                  ]}
                />
              </FormField>

              <FormField label="Allow From" description="Comma-separated user IDs" helpKey="channels.allowFrom">
                <TextInput
                  value={(channel.allowFrom || []).join(', ')}
                  onChange={(v) =>
                    updateChannel(name, {
                      allowFrom: v
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    })
                  }
                  placeholder="user1, user2"
                />
              </FormField>

              <TestConnectionButton
                type={name}
                config={
                  name === 'telegram'
                    ? { botToken: channel.botToken }
                    : { token: channel.token }
                }
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <SelectInput
          value={newChannel}
          onChange={setNewChannel}
          options={[
            { value: '', label: 'Select channel type...' },
            ...CHANNEL_TYPES.filter((t) => !channels[t]).map((t) => ({
              value: t,
              label: t.charAt(0).toUpperCase() + t.slice(1)
            }))
          ]}
        />
        <button
          onClick={addChannel}
          disabled={!newChannel}
          className="flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-muted transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
