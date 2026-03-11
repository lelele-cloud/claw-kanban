import { Send, MessageCircle, Hash, Monitor, Layers, type LucideIcon } from 'lucide-react'
import type { OpenClawConfig } from '@/types/config'

export interface ConfigTemplate {
  id: string
  name: string
  description: string
  icon: LucideIcon
  config: Partial<OpenClawConfig>
  requiredSteps: ('provider' | 'channel' | 'identity')[]
  channelType?: string
}

export const templates: ConfigTemplate[] = [
  {
    id: 'telegram-bot',
    name: 'Telegram 机器人',
    description: '快速搭建一个 Telegram AI 聊天机器人',
    icon: Send,
    channelType: 'telegram',
    config: {
      gateway: { port: 18789, bind: 'loopback', auth: { type: 'token' } },
      channels: {
        telegram: { dmPolicy: 'open' }
      },
      tools: { profile: 'messaging' },
      session: { dmScope: 'per-peer', reset: { policy: 'idle', idleHours: 24 } },
      messages: { ackReaction: '👍' }
    },
    requiredSteps: ['provider', 'channel', 'identity']
  },
  {
    id: 'discord-bot',
    name: 'Discord 机器人',
    description: '在 Discord 服务器中部署 AI 助手',
    icon: MessageCircle,
    channelType: 'discord',
    config: {
      gateway: { port: 18789, bind: 'loopback', auth: { type: 'token' } },
      channels: {
        discord: { dmPolicy: 'pairing', groupPolicy: 'allowlist' }
      },
      tools: { profile: 'messaging' },
      session: { dmScope: 'per-peer', reset: { policy: 'idle', idleHours: 48 } }
    },
    requiredSteps: ['provider', 'channel', 'identity']
  },
  {
    id: 'slack-bot',
    name: 'Slack 机器人',
    description: '为团队 Slack 工作区添加 AI 助手',
    icon: Hash,
    channelType: 'slack',
    config: {
      gateway: { port: 18789, bind: 'loopback', auth: { type: 'token' } },
      channels: {
        slack: { dmPolicy: 'open', groupPolicy: 'open' }
      },
      tools: { profile: 'messaging' },
      session: { dmScope: 'per-channel-peer' }
    },
    requiredSteps: ['provider', 'channel', 'identity']
  },
  {
    id: 'local-assistant',
    name: '本地 AI 助手',
    description: '使用 Ollama 本地模型的 AI 助手，完全离线运行',
    icon: Monitor,
    config: {
      gateway: { port: 18789, bind: 'loopback', auth: { type: 'none' } },
      models: {
        providers: {
          ollama: { baseUrl: 'http://localhost:11434', apiType: 'ollama' }
        }
      },
      agents: {
        defaults: { model: 'llama3.2' }
      },
      tools: { profile: 'full' }
    },
    requiredSteps: ['provider', 'identity']
  },
  {
    id: 'multi-channel',
    name: '多渠道机器人',
    description: '同时接入多个聊天平台的 AI 机器人',
    icon: Layers,
    config: {
      gateway: { port: 18789, bind: 'loopback', auth: { type: 'token' } },
      tools: { profile: 'messaging' },
      session: { dmScope: 'per-channel-peer' }
    },
    requiredSteps: ['provider', 'channel', 'identity']
  }
]
