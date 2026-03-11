import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SwitchInput, SaveButton } from '../common/FormField'
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, Store, Settings2, FolderOpen } from 'lucide-react'
import { ClawHubMarketplace } from './ClawHubMarketplace'
import { cn } from '@/lib/utils'

type SkillsTab = 'marketplace' | 'installed' | 'config'

export function SkillsForm(): JSX.Element {
  const { config, patchConfig, skills, saveSkill, loadSkills } = useConfigStore()
  const [tab, setTab] = useState<SkillsTab>('marketplace')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<{ name: string; content: string } | null>(null)
  const [newSkillName, setNewSkillName] = useState('')
  const [entries, setEntries] = useState<Record<string, { enabled?: boolean; env?: Record<string, string> }>>(
    (config.skills?.entries as Record<string, { enabled?: boolean; env?: Record<string, string> }>) || {}
  )

  useEffect(() => {
    setEntries(
      (config.skills?.entries as Record<string, { enabled?: boolean; env?: Record<string, string> }>) || {}
    )
  }, [config.skills])

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

  const tabs: Array<{ id: SkillsTab; label: string; icon: typeof Store }> = [
    { id: 'marketplace', label: 'ClawHub', icon: Store },
    { id: 'installed', label: 'Installed', icon: FolderOpen },
    { id: 'config', label: 'Config', icon: Settings2 }
  ]

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex rounded-md border overflow-hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id)
              if (t.id === 'installed') loadSkills()
            }}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Marketplace tab */}
      {tab === 'marketplace' && <ClawHubMarketplace />}

      {/* Installed skills tab */}
      {tab === 'installed' && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            SKILL.md files in ~/.openclaw/skills/
          </p>

          {skills.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <Store className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-2">No skills installed yet</p>
              <button
                onClick={() => setTab('marketplace')}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Browse ClawHub marketplace &rarr;
              </button>
            </div>
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
                  {expanded === skill.name ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">{skill.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {skill.content.length > 0
                    ? `${skill.content.split('\n').length} lines`
                    : 'empty'}
                </span>
              </button>
              {expanded === skill.name && editingSkill && (
                <div className="border-t p-3 space-y-2">
                  <textarea
                    value={editingSkill.content}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, content: e.target.value })
                    }
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
      )}

      {/* Config tab */}
      {tab === 'config' && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Skill entries in openclaw.json &mdash; enable/disable and configure environment
          </p>

          {Object.entries(entries).map(([name, entry]) => (
            <div key={name} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{name}</span>
                <div className="flex items-center gap-2">
                  <SwitchInput
                    checked={entry.enabled ?? true}
                    onChange={(v) =>
                      setEntries({ ...entries, [name]: { ...entry, enabled: v } })
                    }
                  />
                  <button
                    onClick={() => removeEntry(name)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {entry.env && Object.keys(entry.env).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(entry.env).map(([k, v]) => (
                    <code key={k} className="text-[10px] bg-muted px-1 py-0.5 rounded">
                      {k}={v ? '***' : '(empty)'}
                    </code>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <TextInput
              value={newSkillName}
              onChange={setNewSkillName}
              placeholder="Skill name"
            />
            <button
              onClick={addEntry}
              disabled={!newSkillName.trim()}
              className="flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-muted transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>

          <FormField
            label="Extra Skill Directories"
            description="Additional directories to search for skills"
          >
            <TextInput
              value={(config.skills?.load?.extraDirs || []).join(', ')}
              onChange={(v) => {
                const dirs = v
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                patchConfig('skills.load.extraDirs', dirs.length > 0 ? dirs : undefined)
              }}
              placeholder="/custom/skills, ~/my-skills"
            />
          </FormField>

          <SaveButton onClick={saveEntries} />
        </div>
      )}
    </div>
  )
}
