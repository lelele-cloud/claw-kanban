export interface SecretRef {
  source: 'env' | 'file' | 'exec'
  provider?: string
  id: string
}

export interface GatewayConfig {
  port?: number
  bind?: 'loopback' | 'lan' | 'tailnet' | string
  auth?: {
    type: 'token' | 'password' | 'trusted-proxy' | 'none'
    token?: string
    password?: { hash: string }
  }
  tailscale?: {
    mode: 'serve' | 'funnel' | 'off'
  }
  controlUi?: {
    enabled: boolean
    port?: number
  }
  reload?: {
    mode: 'hybrid' | 'hot' | 'restart' | 'off'
    debounceMs?: number
  }
}

export interface ProviderConfig {
  baseUrl: string
  apiKey?: string | SecretRef
  apiType: 'anthropic' | 'openai' | 'google' | 'ollama' | string
}

export interface ModelsConfig {
  providers?: Record<string, ProviderConfig>
}

export interface SandboxConfig {
  enabled?: boolean
  mode?: 'off' | 'non-main' | 'all'
  docker?: {
    network?: 'none' | 'bridge' | 'host'
    workspaceAccess?: 'full' | 'read' | 'none'
    resourceLimits?: {
      memory?: string
      cpus?: string
      diskMb?: number
    }
  }
}

export interface MemorySearchConfig {
  enabled?: boolean
  provider?: 'openai' | 'gemini' | 'voyage' | 'mistral' | 'local'
  sync?: {
    sessions?: {
      deltaBytes?: number
      deltaMessages?: number
    }
  }
}

export interface AgentDefaults {
  workspace?: string
  model?: string
  models?: Record<string, { provider: string; model: string; aliases?: string[] }>
  imageModel?: string
  timeout?: string
  contextWindow?: number
  heartbeat?: string
  compaction?: {
    enabled?: boolean
    strategy?: 'summarize' | 'prune' | 'hybrid'
    threshold?: number
  }
  sandbox?: SandboxConfig
  memorySearch?: MemorySearchConfig
  concurrencyLimits?: {
    primary?: number
    subagents?: number
  }
  subagents?: {
    allowAgents?: string[]
    maxSpawnDepth?: number
    maxConcurrent?: number
  }
}

export interface AgentEntry {
  id: string
  workspace?: string
  model?: string
  identity?: {
    name?: string
    role?: string
  }
  subagents?: {
    allowAgents?: string[]
    maxSpawnDepth?: number
    maxConcurrent?: number
  }
}

export interface AgentsConfig {
  defaults?: AgentDefaults
  list?: AgentEntry[]
}

export interface ChannelConfig {
  botToken?: string | SecretRef
  token?: string | SecretRef
  dmPolicy?: 'pairing' | 'allowlist' | 'open' | 'disabled'
  allowFrom?: string[]
  groupPolicy?: 'allowlist' | 'open' | 'disabled'
  mediaMaxMb?: number
  streamingMode?: boolean
  [key: string]: unknown
}

export interface SessionConfig {
  scope?: 'per-sender' | string
  dmScope?: 'main' | 'per-peer' | 'per-channel-peer'
  reset?: {
    policy?: 'daily' | 'idle'
    time?: string
    idleHours?: number
  }
  store?: string
  threadBindings?: {
    enabled?: boolean
    idleHours?: number
    maxAgeHours?: number
  }
  maintenance?: {
    retentionDays?: number
    diskBudgetMb?: number
    cleanupSchedule?: string
  }
}

export interface ToolsConfig {
  profile?: 'minimal' | 'coding' | 'messaging' | 'full'
  allow?: string[]
  deny?: string[]
  exec?: {
    enabled?: boolean
    timeout?: string
    cleanup?: boolean
  }
  elevated?: {
    enabled?: boolean
    allowList?: string[]
  }
  web?: {
    search?: {
      enabled?: boolean
      provider?: string
      apiKey?: string | SecretRef
    }
    fetch?: {
      enabled?: boolean
      maxBytes?: number
    }
  }
  media?: {
    imageModel?: string
    videoModel?: string
  }
}

export interface SkillsConfig {
  entries?: Record<
    string,
    {
      enabled?: boolean
      env?: Record<string, string>
      apiKey?: string | SecretRef
    }
  >
  load?: {
    extraDirs?: string[]
  }
}

export interface MessagesConfig {
  responsePrefix?: string
  ackReaction?: string
  queue?: {
    mode?: 'collect' | 'steer' | 'interrupt'
    batchSize?: number
    batchTimeoutMs?: number
  }
  tts?: {
    enabled?: boolean
    provider?: 'elevenlabs' | 'openai'
    voice?: string
    rate?: string
  }
}

export interface CronConfig {
  enabled?: boolean
  jobs?: Array<{
    schedule: string
    command: string
    agentId?: string
  }>
}

export interface HooksConfig {
  mappings?: Record<string, string>
  gmail?: {
    topicName?: string
  }
}

export interface BindingsConfig {
  routes?: Array<{
    channel: string
    guildId?: string
    allowFrom?: string[]
    agent: string
  }>
}

export interface LoggingConfig {
  level?: 'debug' | 'info' | 'warn' | 'error'
  file?: string
  redact?: {
    enabled?: boolean
    patterns?: string[]
  }
  console?: {
    colors?: boolean
    timestamp?: boolean
  }
}

export interface BrowserConfig {
  enabled?: boolean
  profiles?: Record<
    string,
    {
      path?: string
      cdpPort?: number
    }
  >
  ssrfPolicy?: {
    blockPrivateNetworks?: boolean
    allowList?: string[]
  }
}

export interface SecretsConfig {
  [provider: string]: {
    type: 'env' | 'file' | 'exec'
    allowList?: string[]
    path?: string
    command?: string
  }
}

export interface DiscoveryConfig {
  mdns?: {
    enabled?: boolean
    serviceName?: string
  }
  dnsSd?: {
    enabled?: boolean
  }
}

export interface UiConfig {
  colorScheme?: 'light' | 'dark' | 'auto'
  assistantName?: string
}

export interface IdentityConfig {
  user?: string
  org?: string
}

export interface OpenClawConfig {
  gateway?: GatewayConfig
  models?: ModelsConfig
  agents?: AgentsConfig
  channels?: Record<string, ChannelConfig>
  session?: SessionConfig
  tools?: ToolsConfig
  skills?: SkillsConfig
  messages?: MessagesConfig
  cron?: CronConfig
  hooks?: HooksConfig
  sandbox?: SandboxConfig
  bindings?: BindingsConfig
  logging?: LoggingConfig
  browser?: BrowserConfig
  secrets?: SecretsConfig
  discovery?: DiscoveryConfig
  ui?: UiConfig
  identity?: IdentityConfig
  env?: Record<string, string>
  $include?: string | string[]
  [key: string]: unknown
}
