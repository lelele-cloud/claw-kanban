import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SelectInput, NumberInput, SwitchInput, SaveButton } from '../common/FormField'
import type { MessagesConfig } from '@/types/config'

export function MessagesForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [messages, setMessages] = useState<MessagesConfig>({})

  useEffect(() => {
    setMessages(config.messages || {})
  }, [config.messages])

  const save = async (): Promise<void> => {
    await patchConfig('messages', messages)
  }

  return (
    <div className="space-y-4">
      <FormField label="Response Prefix">
        <TextInput
          value={messages.responsePrefix || ''}
          onChange={(v) => setMessages({ ...messages, responsePrefix: v })}
          placeholder="✨ {model}:"
        />
      </FormField>

      <FormField label="Ack Reaction">
        <TextInput
          value={messages.ackReaction || ''}
          onChange={(v) => setMessages({ ...messages, ackReaction: v })}
          placeholder="👍"
        />
      </FormField>

      <div className="my-2 h-px bg-border" />
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Queue</h3>

      <FormField label="Queue Mode">
        <SelectInput
          value={messages.queue?.mode || 'collect'}
          onChange={(v) => setMessages({ ...messages, queue: { ...messages.queue, mode: v as 'collect' | 'steer' | 'interrupt' } })}
          options={[
            { value: 'collect', label: 'Collect' },
            { value: 'steer', label: 'Steer' },
            { value: 'interrupt', label: 'Interrupt' }
          ]}
        />
      </FormField>

      <div className="my-2 h-px bg-border" />
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TTS</h3>

      <FormField label="TTS Enabled">
        <SwitchInput
          checked={messages.tts?.enabled ?? false}
          onChange={(v) => setMessages({ ...messages, tts: { ...messages.tts, enabled: v } })}
        />
      </FormField>

      {messages.tts?.enabled && (
        <>
          <FormField label="TTS Provider">
            <SelectInput
              value={messages.tts?.provider || 'openai'}
              onChange={(v) => setMessages({ ...messages, tts: { ...messages.tts, provider: v as 'elevenlabs' | 'openai' } })}
              options={[
                { value: 'openai', label: 'OpenAI' },
                { value: 'elevenlabs', label: 'ElevenLabs' }
              ]}
            />
          </FormField>
          <FormField label="Voice">
            <TextInput
              value={messages.tts?.voice || ''}
              onChange={(v) => setMessages({ ...messages, tts: { ...messages.tts, voice: v } })}
              placeholder="nova"
            />
          </FormField>
        </>
      )}

      <SaveButton onClick={save} />
    </div>
  )
}
