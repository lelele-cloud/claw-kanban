import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { useValidation } from '@/hooks/useValidation'
import { messagesSchema } from '@/lib/schemas'
import { FormField, TextInput, SelectInput, SwitchInput, SaveButton } from '../common/FormField'
import type { MessagesConfig } from '@/types/config'

export function MessagesForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [messages, setMessages] = useState<MessagesConfig>({})
  const { hasErrors } = useValidation(messagesSchema, messages)

  useEffect(() => {
    setMessages(config.messages || {})
  }, [config.messages])

  const save = async (): Promise<void> => {
    await patchConfig('messages', messages)
  }

  return (
    <div className="space-y-4">
      <FormField label="Response Prefix" helpKey="messages.responsePrefix">
        <TextInput
          value={messages.responsePrefix || ''}
          onChange={(v) => setMessages({ ...messages, responsePrefix: v })}
          placeholder="✨ {model}:"
        />
      </FormField>

      <FormField label="Ack Reaction" helpKey="messages.ackReaction">
        <TextInput
          value={messages.ackReaction || ''}
          onChange={(v) => setMessages({ ...messages, ackReaction: v })}
          placeholder="👍"
        />
      </FormField>

      <div className="my-2 h-px bg-border" />
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Queue</h3>

      <FormField label="Queue Mode" helpKey="messages.queue.mode">
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
          <FormField label="TTS Provider" helpKey="messages.tts.provider">
            <SelectInput
              value={messages.tts?.provider || 'openai'}
              onChange={(v) => setMessages({ ...messages, tts: { ...messages.tts, provider: v as 'elevenlabs' | 'openai' } })}
              options={[
                { value: 'openai', label: 'OpenAI' },
                { value: 'elevenlabs', label: 'ElevenLabs' }
              ]}
            />
          </FormField>
          <FormField label="Voice" helpKey="messages.tts.voice">
            <TextInput
              value={messages.tts?.voice || ''}
              onChange={(v) => setMessages({ ...messages, tts: { ...messages.tts, voice: v } })}
              placeholder="nova"
            />
          </FormField>
        </>
      )}

      <SaveButton onClick={save} disabled={hasErrors} />
    </div>
  )
}
