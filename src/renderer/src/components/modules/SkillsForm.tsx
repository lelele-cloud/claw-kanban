import { useState } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SwitchInput, SaveButton } from '../common/FormField'
import { Plus, Trash2, ChevronDown, ChevronRight, FileText } from 'lucide-react'

export function SkillsForm(): JSX.Element {
  const { config, patchConfig, skills, saveSkill } = useConfigStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<{ name: string; content: string } | null>(null)
  const [newSkillName, setNewSkillName] = useState('')
  const [entries, setEntries] = useState<Record<string, { enabled?: boolean; env?: Record<string, string> }>>(
    (config.skills?.entries as Record<string, { enabled?: boolean; env?: Record<string, string> }>) || {}
  )

  const saveEntries = async (): Promise<void> => {
    await patchConfig('skills', { ...config.skills, entries })
  }

  const addEntry = (): void => {
    if (!newSkillName.trim()) return
    setEntries({ ...entries, [newSkillName.trim()]: { enabled: true } })
    setNewSkillName('')
  }

  const removeEntry = (name: string): void => {
    const updated = { ...entries }
    delete updated[name]
    setEntries(updated)
  }

  const handleSaveSkillFile = async (): Promise<void> => {
    if (!editingSkill) return
    await saveSkill(editingSkill.name, editingSkill.content)
    setEditingSkill(null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Skill Entries (Config)
      </h3>

      {Object.entries(entries).map(([name, entry]) => (
        <div key={name} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{name}</span>
            <div className="flex items-center gap-2">
              <SwitchInput
                checked={entry.enabled ?? true}
                onChange={(v) => setEntries({ ...entries, [name]: { ...entry, enabled: v } })}
              />
              <button onClick={() => removeEntry(name)} className="text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <TextInput value={newSkillName} onChange={setNewSkillName} placeholder="Skill name" />
        <button
          onClick={addEntry}
          disabled={!newSkillName.trim()}
          className="flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-muted transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      <SaveButton onClick={saveEntries} />

      <div className="my-3 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        SKILL.md Files
      </h3>

      {skills.length === 0 && (
        <p className="text-xs text-muted-foreground">No SKILL.md files found in ~/.openclaw/skills/</p>
      )}

      {skills.map((skill) => (
        <div key={skill.name} className="rounded-lg border overflow-hidden">
          <button
            onClick={() => {
              if (expanded === skill.name) {
                setExpanded(null)
                setEditingSkill(null)
              } else {
                setExpanded(skill.name)
                setEditingSkill({ name: skill.name, content: skill.content })
              }
            }}
            className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {expanded === skill.name ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">{skill.name}</span>
            </div>
          </button>
          {expanded === skill.name && editingSkill && (
            <div className="border-t p-3 space-y-2">
              <textarea
                value={editingSkill.content}
                onChange={(e) => setEditingSkill({ ...editingSkill, content: e.target.value })}
                className="w-full h-48 rounded-md border bg-muted/30 p-2 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={handleSaveSkillFile}
                className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Save SKILL.md
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
