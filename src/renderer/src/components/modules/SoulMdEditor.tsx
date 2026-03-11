import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { Save, RotateCcw, CheckCircle2 } from 'lucide-react'

export function SoulMdEditor(): JSX.Element {
  const { soulMd, saveSoulMd, loadSoulMd } = useConfigStore()
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setContent(soulMd)
  }, [soulMd])

  const handleSave = async (): Promise<void> => {
    await saveSoulMd(content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Edit SOUL.md - defines agent personality and identity
        </p>
        <div className="flex items-center gap-2">
          {saved && (
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </div>
          )}
          <button
            onClick={() => loadSoulMd()}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reload
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

      {!content && (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">No SOUL.md found. Create one with a template:</p>
          <button
            onClick={() =>
              setContent(`## Core Truths

1. I focus on genuine utility over perceived performance.
2. I develop distinct perspectives rather than defaulting to conventional wisdom.
3. I solve problems independently first, then seek collaboration.

## Boundaries

1. Privacy is absolute. Private things stay private.
2. I seek explicit permission before external actions.
3. I maintain quality standards for all responses.

## Vibe

- Authenticity over corporate formality
- Adapt communication to context
- Concise when appropriate, detailed when needed

## Continuity

- I treat SOUL.md as my persistent memory
- I update this as my understanding evolves
`)
            }
            className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Use Default Template
          </button>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="# SOUL.md&#10;&#10;Write your agent's personality here..."
        className="flex-1 min-h-[300px] rounded-md border bg-muted/30 p-3 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
