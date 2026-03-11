import { z } from 'zod'

// --- Shared schemas ---

const secretRefSchema = z.object({
  source: z.enum(['env', 'file', 'exec']),
  provider: z.string().optional(),
  id: z.string().min(1)
})

const apiKeySchema = z.union([
  z.string().min(1, 'API 密钥不能为空'),
  secretRefSchema
])

// --- Gateway ---

export const gatewaySchema = z.object({
  port: z.number().int().min(1, '端口必须 >= 1').max(65535, '端口必须 <= 65535').optional(),
  bind: z.string().optional(),
  auth: z.object({
    type: z.enum(['token', 'password', 'trusted-proxy', 'none']),
    token: z.string().min(8, 'Token 至少 8 位').optional()
  }).optional(),
  tailscale: z.object({
    mode: z.enum(['serve', 'funnel', 'off'])
  }).optional(),
  controlUi: z.object({
    enabled: z.boolean(),
    port: z.number().int().min(1).max(65535).optional()
  }).optional(),
  reload: z.object({
    mode: z.enum(['hybrid', 'hot', 'restart', 'off']),
    debounceMs: z.number().int().min(0).optional()
  }).optional()
}).optional()

// --- Models ---

export const providerSchema = z.object({
  baseUrl: z.string().url('请输入有效的 URL'),
  apiKey: apiKeySchema.optional(),
  apiType: z.string().min(1, '请选择 API 类型')
})

export const modelsSchema = z.object({
  providers: z.record(providerSchema).optional()
}).optional()

// --- Agents ---

export const agentEntrySchema = z.object({
  id: z.string().min(1, 'Agent ID 不能为空'),
  workspace: z.string().optional(),
  model: z.string().optional(),
  identity: z.object({
    name: z.string().optional(),
    role: z.string().optional()
  }).optional()
})

export const agentsSchema = z.object({
  defaults: z.object({
    workspace: z.string().optional(),
    model: z.string().optional(),
    timeout: z.string().regex(/^\d+[smhd]$/, '格式: 30s, 5m, 1h').optional().or(z.literal('')),
    contextWindow: z.number().int().min(1000).max(2000000).optional(),
    concurrencyLimits: z.object({
      primary: z.number().int().min(1, '至少为 1').optional(),
      subagents: z.number().int().min(1).optional()
    }).optional()
  }).optional(),
  list: z.array(agentEntrySchema).optional()
}).optional()

// --- Channels ---

export const channelSchema = z.object({
  botToken: z.union([z.string(), secretRefSchema]).optional(),
  token: z.union([z.string(), secretRefSchema]).optional(),
  dmPolicy: z.enum(['pairing', 'allowlist', 'open', 'disabled']).optional(),
  groupPolicy: z.enum(['allowlist', 'open', 'disabled']).optional(),
  allowFrom: z.array(z.string()).optional(),
  mediaMaxMb: z.number().min(0).optional(),
  streamingMode: z.boolean().optional()
})

export const channelsSchema = z.record(channelSchema).optional()

// --- Session ---

export const sessionSchema = z.object({
  dmScope: z.enum(['main', 'per-peer', 'per-channel-peer']).optional(),
  reset: z.object({
    policy: z.enum(['daily', 'idle']).optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/, '格式: HH:MM (如 04:00)').optional().or(z.literal('')),
    idleHours: z.number().min(1, '至少 1 小时').optional()
  }).optional(),
  store: z.string().optional(),
  threadBindings: z.object({
    enabled: z.boolean().optional(),
    idleHours: z.number().min(1).optional(),
    maxAgeHours: z.number().min(1).optional()
  }).optional(),
  maintenance: z.object({
    retentionDays: z.number().int().min(1, '至少保留 1 天').optional(),
    diskBudgetMb: z.number().min(1).optional(),
    cleanupSchedule: z.string().optional()
  }).optional()
}).optional()

// --- Tools ---

export const toolsSchema = z.object({
  profile: z.enum(['minimal', 'coding', 'messaging', 'full']).optional(),
  allow: z.array(z.string()).optional(),
  deny: z.array(z.string()).optional(),
  exec: z.object({
    enabled: z.boolean().optional(),
    timeout: z.string().optional(),
    cleanup: z.boolean().optional()
  }).optional(),
  elevated: z.object({
    enabled: z.boolean().optional(),
    allowList: z.array(z.string()).optional()
  }).optional(),
  web: z.object({
    search: z.object({
      enabled: z.boolean().optional(),
      provider: z.string().optional(),
      apiKey: apiKeySchema.optional()
    }).optional(),
    fetch: z.object({
      enabled: z.boolean().optional(),
      maxBytes: z.number().int().min(0).optional()
    }).optional()
  }).optional(),
  media: z.object({
    imageModel: z.string().optional(),
    videoModel: z.string().optional()
  }).optional()
}).optional()

// --- Skills ---

export const skillsSchema = z.object({
  entries: z.record(z.object({
    enabled: z.boolean().optional(),
    env: z.record(z.string()).optional(),
    apiKey: apiKeySchema.optional()
  })).optional(),
  load: z.object({
    extraDirs: z.array(z.string()).optional()
  }).optional()
}).optional()

// --- Messages ---

export const messagesSchema = z.object({
  responsePrefix: z.string().optional(),
  ackReaction: z.string().optional(),
  queue: z.object({
    mode: z.enum(['collect', 'steer', 'interrupt']).optional(),
    batchSize: z.number().int().min(1).optional(),
    batchTimeoutMs: z.number().int().min(0).optional()
  }).optional(),
  tts: z.object({
    enabled: z.boolean().optional(),
    provider: z.enum(['elevenlabs', 'openai']).optional(),
    voice: z.string().optional(),
    rate: z.string().optional()
  }).optional()
}).optional()

// --- Cron ---

export const cronJobSchema = z.object({
  schedule: z.string().min(1, 'Cron 表达式不能为空'),
  command: z.string().min(1, '命令不能为空'),
  agentId: z.string().optional()
})

export const cronSchema = z.object({
  enabled: z.boolean().optional(),
  jobs: z.array(cronJobSchema).optional()
}).optional()

// --- Hooks ---

export const hooksSchema = z.object({
  mappings: z.record(z.string()).optional(),
  gmail: z.object({
    topicName: z.string().optional()
  }).optional()
}).optional()

// --- Bindings ---

export const bindingRouteSchema = z.object({
  channel: z.string().min(1, '渠道名不能为空'),
  guildId: z.string().optional(),
  allowFrom: z.array(z.string()).optional(),
  agent: z.string().min(1, 'Agent ID 不能为空')
})

export const bindingsSchema = z.object({
  routes: z.array(bindingRouteSchema).optional()
}).optional()

// --- Logging ---

export const loggingSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']).optional(),
  file: z.string().optional(),
  redact: z.object({
    enabled: z.boolean().optional(),
    patterns: z.array(z.string()).optional()
  }).optional(),
  console: z.object({
    colors: z.boolean().optional(),
    timestamp: z.boolean().optional()
  }).optional()
}).optional()

// --- Browser ---

export const browserSchema = z.object({
  enabled: z.boolean().optional(),
  profiles: z.record(z.object({
    path: z.string().optional(),
    cdpPort: z.number().int().min(1).max(65535).optional()
  })).optional(),
  ssrfPolicy: z.object({
    blockPrivateNetworks: z.boolean().optional(),
    allowList: z.array(z.string()).optional()
  }).optional()
}).optional()

// --- Secrets ---

export const secretProviderSchema = z.object({
  type: z.enum(['env', 'file', 'exec']),
  allowList: z.array(z.string()).optional(),
  path: z.string().optional(),
  command: z.string().optional()
})

export const secretsSchema = z.record(secretProviderSchema).optional()

// --- Discovery ---

export const discoverySchema = z.object({
  mdns: z.object({
    enabled: z.boolean().optional(),
    serviceName: z.string().optional()
  }).optional(),
  dnsSd: z.object({
    enabled: z.boolean().optional()
  }).optional()
}).optional()

// --- UI & Identity ---

export const uiSchema = z.object({
  colorScheme: z.enum(['light', 'dark', 'auto']).optional(),
  assistantName: z.string().optional()
}).optional()

export const identitySchema = z.object({
  user: z.string().optional(),
  org: z.string().optional()
}).optional()

// --- Sandbox ---

export const sandboxSchema = z.object({
  enabled: z.boolean().optional(),
  mode: z.enum(['off', 'non-main', 'all']).optional(),
  docker: z.object({
    network: z.enum(['none', 'bridge', 'host']).optional(),
    workspaceAccess: z.enum(['full', 'read', 'none']).optional(),
    resourceLimits: z.object({
      memory: z.string().optional(),
      cpus: z.string().optional(),
      diskMb: z.number().min(0).optional()
    }).optional()
  }).optional()
}).optional()

// --- Memory Search ---

export const memorySearchSchema = z.object({
  enabled: z.boolean().optional(),
  provider: z.enum(['openai', 'gemini', 'voyage', 'mistral', 'local']).optional(),
  sync: z.object({
    sessions: z.object({
      deltaBytes: z.number().int().min(0).optional(),
      deltaMessages: z.number().int().min(0).optional()
    }).optional()
  }).optional()
}).optional()

// --- Config schema registry ---

export const configSchemas: Record<string, z.ZodType> = {
  gateway: gatewaySchema,
  models: modelsSchema,
  agents: agentsSchema,
  channels: channelsSchema,
  session: sessionSchema,
  tools: toolsSchema,
  skills: skillsSchema,
  messages: messagesSchema,
  cron: cronSchema,
  hooks: hooksSchema,
  bindings: bindingsSchema,
  logging: loggingSchema,
  browser: browserSchema,
  secrets: secretsSchema,
  discovery: discoverySchema,
  ui: uiSchema,
  identity: identitySchema,
  sandbox: sandboxSchema,
  memorySearch: memorySearchSchema
}

/**
 * Validate a config section and return field errors
 */
export function validateSection(
  schemaKey: string,
  data: unknown
): Record<string, string> {
  const schema = configSchemas[schemaKey]
  if (!schema) return {}

  const result = schema.safeParse(data)
  if (result.success) return {}

  const errors: Record<string, string> = {}
  result.error.issues.forEach((issue) => {
    errors[issue.path.join('.')] = issue.message
  })
  return errors
}
