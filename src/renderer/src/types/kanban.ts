import { type LucideIcon } from 'lucide-react'

export type ConfigStatus = 'configured' | 'unconfigured' | 'error' | 'warning'

export interface KanbanCardDef {
  id: string
  title: string
  description: string
  icon: LucideIcon
  configKey: string
  getSummary: (config: Record<string, unknown>) => string
  getStatus: (config: Record<string, unknown>) => ConfigStatus
}

export interface KanbanColumnDef {
  id: string
  title: string
  color: string
  cards: KanbanCardDef[]
}
