import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { SaveButton } from '../common/FormField'

export function PluginsForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [text, setText] = useState('')

  useEffect(() => {
    setText(JSON.stringify(config.plugins || {}, null, 2))
  }, [config.plugins])

  const save = async (): Promise<void> => {
    try {
      const parsed = JSON.parse(text)
      await patchConfig('plugins', parsed)
    } catch {
      // invalid JSON
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Configure plugins. Edit the raw JSON below.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 rounded-md border bg-muted/30 p-3 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        placeholder="{}"
      />
      <SaveButton onClick={save} />
    </div>
  )
}
