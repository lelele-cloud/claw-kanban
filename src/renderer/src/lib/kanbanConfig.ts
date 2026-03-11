import {
  Server,
  Cpu,
  Users,
  MessageSquare,
  Palette,
  FileText,
  Send,
  MessagesSquare,
  Bot,
  Wrench,
  Sparkles,
  Heart,
  Brain,
  Shield,
  Clock,
  Webhook,
  Route,
  Globe,
  Lock,
  Radio,
  Puzzle,
  type LucideIcon
} from 'lucide-react'
import type { KanbanColumnDef, ConfigStatus, KanbanCardDef } from '../types/kanban'

function hasKey(obj: Record<string, unknown>, key: string): boolean {
  return obj[key] !== undefined && obj[key] !== null && Object.keys(obj[key] as object).length > 0
}

function getStatus(config: Record<string, unknown>, key: string): ConfigStatus {
  return hasKey(config, key) ? 'configured' : 'unconfigured'
}

function channelCount(config: Record<string, unknown>): string {
  const channels = config.channels as Record<string, unknown> | undefined
  if (!channels) return 'No channels configured'
  const count = Object.keys(channels).length
  return `${count} channel${count !== 1 ? 's' : ''} configured`
}

function providerCount(config: Record<string, unknown>): string {
  const models = config.models as Record<string, unknown> | undefined
  const providers = models?.providers as Record<string, unknown> | undefined
  if (!providers) return 'No providers'
  const count = Object.keys(providers).length
  return `${count} provider${count !== 1 ? 's' : ''}`
}

function agentCount(config: Record<string, unknown>): string {
  const agents = config.agents as Record<string, unknown> | undefined
  const list = agents?.list as unknown[] | undefined
  const model = (agents?.defaults as Record<string, unknown>)?.model as string | undefined
  const parts: string[] = []
  if (model) parts.push(`Model: ${model}`)
  if (list) parts.push(`${list.length} agent${list.length !== 1 ? 's' : ''}`)
  return parts.length > 0 ? parts.join(' | ') : 'Not configured'
}

function gatewayInfo(config: Record<string, unknown>): string {
  const gw = config.gateway as Record<string, unknown> | undefined
  if (!gw) return 'Not configured'
  const parts: string[] = []
  if (gw.port) parts.push(`Port: ${gw.port}`)
  if (gw.bind) parts.push(`Bind: ${gw.bind}`)
  const auth = gw.auth as Record<string, unknown> | undefined
  if (auth?.type) parts.push(`Auth: ${auth.type}`)
  return parts.length > 0 ? parts.join(' | ') : 'Default settings'
}

function toolsInfo(config: Record<string, unknown>): string {
  const tools = config.tools as Record<string, unknown> | undefined
  if (!tools) return 'Not configured'
  const profile = tools.profile as string | undefined
  return profile ? `Profile: ${profile}` : 'Custom configuration'
}

function sessionInfo(config: Record<string, unknown>): string {
  const session = config.session as Record<string, unknown> | undefined
  if (!session) return 'Not configured'
  const reset = session.reset as Record<string, unknown> | undefined
  return reset?.policy ? `Reset: ${reset.policy}` : 'Custom settings'
}

function simpleInfo(config: Record<string, unknown>, key: string, fallback: string): string {
  return hasKey(config, key) ? 'Configured' : fallback
}

function makeCard(
  id: string,
  title: string,
  description: string,
  icon: LucideIcon,
  configKey: string,
  getSummaryFn: (config: Record<string, unknown>) => string,
  getStatusFn?: (config: Record<string, unknown>) => ConfigStatus
): KanbanCardDef {
  return {
    id,
    title,
    description,
    icon,
    configKey,
    getSummary: getSummaryFn,
    getStatus: getStatusFn || ((c) => getStatus(c, configKey))
  }
}

export const kanbanColumns: KanbanColumnDef[] = [
  {
    id: 'core',
    title: 'Core Configuration',
    color: 'bg-blue-500',
    cards: [
      makeCard('gateway', 'Gateway', 'Port, binding, authentication', Server, 'gateway', gatewayInfo),
      makeCard('models', 'Models & Providers', 'AI model providers and catalog', Cpu, 'models', providerCount),
      makeCard('session', 'Session', 'Conversation scope and lifecycle', Users, 'session', sessionInfo),
      makeCard('messages', 'Messages', 'Response formatting and TTS', MessageSquare, 'messages', (c) => simpleInfo(c, 'messages', 'Default formatting')),
      makeCard('ui-identity', 'UI & Identity', 'Color scheme and identity', Palette, 'ui', (c) => {
        const ui = c.ui as Record<string, unknown> | undefined
        return ui?.colorScheme ? `Theme: ${ui.colorScheme}` : 'Default theme'
      }),
      makeCard('logging', 'Logging', 'Log levels and redaction', FileText, 'logging', (c) => {
        const log = c.logging as Record<string, unknown> | undefined
        return log?.level ? `Level: ${log.level}` : 'Default logging'
      }),
      makeCard('secrets', 'Secrets & Environment', 'Credential management and env vars', Lock, 'secrets', (c) => {
        const hasSecrets = hasKey(c, 'secrets')
        const hasEnv = hasKey(c, 'env')
        if (hasSecrets && hasEnv) return 'Secrets + Env configured'
        if (hasSecrets) return 'Secrets configured'
        if (hasEnv) return 'Env vars configured'
        return 'Not configured'
      }, (c) => hasKey(c, 'secrets') || hasKey(c, 'env') ? 'configured' : 'unconfigured')
    ]
  },
  {
    id: 'channels',
    title: 'Channels & Connections',
    color: 'bg-green-500',
    cards: [
      makeCard('channels', 'Channels', 'Messaging platform integrations', Send, 'channels', channelCount)
    ]
  },
  {
    id: 'agents',
    title: 'Agents & Skills',
    color: 'bg-purple-500',
    cards: [
      makeCard('agents', 'Agents', 'Agent defaults and custom agents', Bot, 'agents', agentCount),
      makeCard('skills', 'Skills & ClawHub', 'Browse, install & manage skills', Sparkles, 'skills', (c) => simpleInfo(c, 'skills', 'Browse ClawHub marketplace')),
      makeCard('soul-md', 'SOUL.md', 'Agent personality and identity', Heart, 'soul-md', () => 'Click to edit', () => 'configured' as ConfigStatus),
      makeCard('tools', 'Tools', 'Tool access and permissions', Wrench, 'tools', toolsInfo),
      makeCard('memory', 'Memory Search', 'Vector search and recall', Brain, 'agents', (c) => {
        const agents = c.agents as Record<string, unknown> | undefined
        const defaults = agents?.defaults as Record<string, unknown> | undefined
        const mem = defaults?.memorySearch as Record<string, unknown> | undefined
        return mem?.enabled ? `Provider: ${mem.provider || 'auto'}` : 'Not configured'
      }, (c) => {
        const agents = c.agents as Record<string, unknown> | undefined
        const defaults = agents?.defaults as Record<string, unknown> | undefined
        const mem = defaults?.memorySearch as Record<string, unknown> | undefined
        return mem?.enabled ? 'configured' : 'unconfigured'
      })
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Settings',
    color: 'bg-orange-500',
    cards: [
      makeCard('sandbox', 'Sandbox', 'Docker isolation and security', Shield, 'sandbox', (c) => {
        const sb = c.sandbox as Record<string, unknown> | undefined
        const agentSb = (c.agents as Record<string, unknown> | undefined)?.defaults as Record<string, unknown> | undefined
        const mode = sb?.mode || (agentSb?.sandbox as Record<string, unknown> | undefined)?.mode
        return mode ? `Mode: ${mode}` : 'Disabled'
      }, (c) => {
        return hasKey(c, 'sandbox') || hasKey(c, 'agents') ? 'configured' : 'unconfigured'
      }),
      makeCard('cron', 'Cron Jobs', 'Scheduled automation', Clock, 'cron', (c) => {
        const cron = c.cron as Record<string, unknown> | undefined
        const jobs = cron?.jobs as unknown[] | undefined
        return jobs ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''}` : 'No jobs'
      }),
      makeCard('hooks', 'Hooks', 'Webhook integration', Webhook, 'hooks', (c) => simpleInfo(c, 'hooks', 'No hooks')),
      makeCard('bindings', 'Bindings', 'Multi-agent routing', Route, 'bindings', (c) => {
        const b = c.bindings as Record<string, unknown> | undefined
        const routes = b?.routes as unknown[] | undefined
        return routes ? `${routes.length} route${routes.length !== 1 ? 's' : ''}` : 'No routes'
      }),
      makeCard('browser', 'Browser', 'Browser automation', Globe, 'browser', (c) => {
        const br = c.browser as Record<string, unknown> | undefined
        return br?.enabled ? 'Enabled' : 'Disabled'
      }),
      makeCard('discovery', 'Discovery', 'mDNS and DNS-SD', Radio, 'discovery', (c) => simpleInfo(c, 'discovery', 'Disabled')),
      makeCard('plugins', 'Plugins', 'Plugin configuration', Puzzle, 'plugins', (c) => simpleInfo(c, 'plugins', 'No plugins'))
    ]
  }
]

export function getAllCards(): KanbanCardDef[] {
  return kanbanColumns.flatMap((col) => col.cards)
}

export function findCard(cardId: string): KanbanCardDef | undefined {
  return getAllCards().find((c) => c.id === cardId)
}
