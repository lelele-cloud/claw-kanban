import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { Save, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react'

export function JsonView(): JSX.Element {
  const { config, saveConfig } = useConfigStore()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setText(JSON.stringify(config, null, 2))
  }, [config])

  const handleSave = async (): Promise<void> => {
    try {
      const parsed = JSON.parse(text)
      setError(null)
      await saveConfig(parsed)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(String(err))
    }
  }

  const handleReset = (): void => {
    setText(JSON.stringify(config, null, 2))
    setError(null)
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Raw JSON Configuration</h2>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-1 text-destructive text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              Invalid JSON
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </div>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Save className="h-3 w-3" />
            Save
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setError(null)
        }}
        spellCheck={false}
        className="flex-1 rounded-md border bg-muted/30 p-3 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
