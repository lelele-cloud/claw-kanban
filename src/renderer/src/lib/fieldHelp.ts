interface FieldHelpEntry {
  description: string
  tip?: string
}

export const fieldHelp: Record<string, FieldHelpEntry> = {
  // --- Gateway ---
  'gateway.port': {
    description: 'OpenClaw 网关监听端口',
    tip: '默认 18789。如果被占用可以改为其他端口'
  },
  'gateway.bind': {
    description: '网络绑定模式',
    tip: 'loopback = 仅本地访问, lan = 局域网访问, tailnet = Tailscale 网络'
  },
  'gateway.auth.type': {
    description: '访问认证方式',
    tip: '推荐使用 token 认证。设为 none 仅用于本地测试'
  },
  'gateway.auth.token': {
    description: '认证令牌',
    tip: '至少 8 位字符，建议使用随机生成的强密码'
  },
  'gateway.reload.mode': {
    description: '配置热重载模式',
    tip: 'hybrid = 安全重载, hot = 即时重载, restart = 重启进程, off = 不重载'
  },

  // --- Models ---
  'models.providers.baseUrl': {
    description: 'AI 提供商的 API 地址',
    tip: 'Anthropic: https://api.anthropic.com | OpenAI: https://api.openai.com/v1 | Ollama: http://localhost:11434'
  },
  'models.providers.apiType': {
    description: 'API 类型决定了请求格式',
    tip: '必须与提供商匹配，否则请求会失败'
  },
  'models.providers.apiKey': {
    description: 'API 密钥',
    tip: '支持直接填入密钥或使用 ${ENV_VAR} 引用环境变量'
  },

  // --- Agents ---
  'agents.defaults.workspace': {
    description: '默认工作目录',
    tip: 'Agent 的文件操作将在此目录下进行'
  },
  'agents.defaults.model': {
    description: '默认 AI 模型',
    tip: '如 claude-opus-4-6, gpt-4o, gemini-pro 等'
  },
  'agents.defaults.timeout': {
    description: '单次任务超时时间',
    tip: '格式: 30s, 5m, 1h, 1d'
  },
  'agents.defaults.contextWindow': {
    description: '上下文窗口大小（token 数）',
    tip: '越大则记忆越长，但成本也越高'
  },
  'agents.defaults.concurrencyLimits.primary': {
    description: '主 Agent 并发数',
    tip: '同时处理的对话数量上限'
  },
  'agents.defaults.concurrencyLimits.subagents': {
    description: '子 Agent 并发数',
    tip: '同时运行的子 Agent 数量上限'
  },
  'agents.list.id': {
    description: 'Agent 唯一标识',
    tip: '用于路由和绑定配置中引用此 Agent'
  },

  // --- Channels ---
  'channels.botToken': {
    description: '机器人令牌',
    tip: 'Telegram: 从 @BotFather 获取 | Discord: 从开发者门户获取'
  },
  'channels.dmPolicy': {
    description: '私聊消息策略',
    tip: 'pairing = 配对验证, allowlist = 白名单, open = 开放, disabled = 禁用'
  },
  'channels.groupPolicy': {
    description: '群组消息策略',
    tip: 'allowlist = 白名单, open = 开放, disabled = 禁用'
  },
  'channels.allowFrom': {
    description: '允许的用户 ID',
    tip: '逗号分隔，只有列表中的用户才能与机器人互动'
  },

  // --- Session ---
  'session.dmScope': {
    description: '对话隔离范围',
    tip: 'main = 所有人共享, per-peer = 每人独立, per-channel-peer = 每渠道每人独立'
  },
  'session.reset.policy': {
    description: '会话重置策略',
    tip: 'daily = 每天定时重置, idle = 空闲超时后重置'
  },
  'session.reset.time': {
    description: '每日重置时间',
    tip: '格式 HH:MM，如 04:00 表示凌晨4点重置'
  },
  'session.reset.idleHours': {
    description: '空闲超时小时数',
    tip: '超过此时间无活动后自动重置会话'
  },
  'session.store': {
    description: '会话存储路径',
    tip: '会话数据文件的保存位置'
  },
  'session.threadBindings.enabled': {
    description: '线程绑定',
    tip: '启用后，群组中的回复将在同一对话线程中继续'
  },
  'session.maintenance.retentionDays': {
    description: '数据保留天数',
    tip: '超过此天数的旧会话数据将被自动清理'
  },
  'session.maintenance.diskBudgetMb': {
    description: '磁盘空间预算 (MB)',
    tip: '会话数据占用超过此值后将自动清理旧数据'
  },

  // --- Tools ---
  'tools.profile': {
    description: '工具配置模板',
    tip: 'minimal = 最少工具, coding = 编程工具, messaging = 消息工具, full = 全部工具'
  },
  'tools.allow': {
    description: '允许的工具列表',
    tip: '逗号分隔的工具名称或通配符，如 git.*, web.*'
  },
  'tools.deny': {
    description: '禁止的工具列表',
    tip: '逗号分隔的工具名称，如 rm, exec'
  },
  'tools.exec.timeout': {
    description: '命令执行超时',
    tip: '格式: 30s, 5m 等'
  },
  'tools.web.fetch.maxBytes': {
    description: '网页抓取最大字节数',
    tip: '默认约 10MB (10485760 bytes)'
  },

  // --- Messages ---
  'messages.responsePrefix': {
    description: '回复消息前缀模板',
    tip: '支持变量 {model} 等'
  },
  'messages.ackReaction': {
    description: '消息确认表情',
    tip: '收到消息后自动添加此表情反应'
  },
  'messages.queue.mode': {
    description: '消息队列模式',
    tip: 'collect = 收集后批量处理, steer = 引导对话, interrupt = 允许中断'
  },
  'messages.tts.provider': {
    description: '文字转语音服务商',
    tip: 'OpenAI 或 ElevenLabs'
  },
  'messages.tts.voice': {
    description: '语音角色',
    tip: 'OpenAI: alloy, echo, fable, onyx, nova, shimmer'
  },

  // --- Sandbox ---
  'sandbox.mode': {
    description: 'Docker 沙盒模式',
    tip: 'off = 关闭, non-main = 仅子 Agent, all = 所有 Agent'
  },
  'sandbox.docker.network': {
    description: 'Docker 网络模式',
    tip: 'none = 完全隔离, bridge = 桥接网络, host = 共享主机网络'
  },
  'sandbox.docker.workspaceAccess': {
    description: '工作目录访问权限',
    tip: 'none = 无权限, read = 只读, full = 完全访问'
  },
  'sandbox.docker.resourceLimits.memory': {
    description: '内存限制',
    tip: '格式: 256m, 1g 等'
  },
  'sandbox.docker.resourceLimits.cpus': {
    description: 'CPU 限制',
    tip: '如 0.5 = 半核, 1.0 = 一核, 2.0 = 两核'
  },

  // --- Cron ---
  'cron.enabled': {
    description: '定时任务开关',
    tip: '启用后将按计划执行任务'
  },
  'cron.jobs.schedule': {
    description: 'Cron 表达式',
    tip: '如 "0 9 * * *" = 每天早上9点, "*/5 * * * *" = 每5分钟'
  },
  'cron.jobs.command': {
    description: '要执行的命令',
    tip: '发送给 Agent 的指令内容'
  },

  // --- Logging ---
  'logging.level': {
    description: '日志级别',
    tip: 'debug = 所有细节, info = 一般信息, warn = 警告, error = 仅错误'
  },
  'logging.file': {
    description: '日志文件路径',
    tip: '留空则只输出到控制台'
  },
  'logging.redact.enabled': {
    description: '日志脱敏',
    tip: '启用后自动隐藏敏感信息（如 API 密钥）'
  },

  // --- Browser ---
  'browser.enabled': {
    description: '浏览器自动化',
    tip: '启用后 Agent 可以操作浏览器'
  },
  'browser.ssrfPolicy.blockPrivateNetworks': {
    description: '阻止访问内网地址',
    tip: '安全设置，防止 SSRF 攻击'
  },

  // --- Discovery ---
  'discovery.mdns.enabled': {
    description: 'mDNS 服务发现',
    tip: '允许局域网内的设备自动发现此 OpenClaw 实例'
  },
  'discovery.mdns.serviceName': {
    description: 'mDNS 服务名称',
    tip: '在局域网中广播的服务名称'
  },

  // --- Secrets ---
  'secrets.type': {
    description: '密钥提供方式',
    tip: 'env = 环境变量, file = 文件读取, exec = 执行命令'
  },

  // --- Memory Search ---
  'memorySearch.enabled': {
    description: '向量搜索与记忆功能',
    tip: '启用后 Agent 可以搜索和回忆以前的对话内容'
  },
  'memorySearch.provider': {
    description: '嵌入向量提供商',
    tip: '用于生成文本嵌入向量的 AI 服务'
  },
  'memorySearch.sync.sessions.deltaBytes': {
    description: '同步字节阈值',
    tip: '累积变化达到此字节数后触发同步'
  },
  'memorySearch.sync.sessions.deltaMessages': {
    description: '同步消息阈值',
    tip: '累积消息达到此数量后触发同步'
  },

  // --- UI & Identity ---
  'ui.colorScheme': {
    description: '界面配色方案',
    tip: 'light = 浅色, dark = 深色, auto = 跟随系统'
  },
  'ui.assistantName': {
    description: '助手显示名称',
    tip: '在界面和消息中显示的 AI 助手名称'
  },
  'identity.user': {
    description: '用户名',
    tip: '你的显示名称'
  },
  'identity.org': {
    description: '组织名',
    tip: '你所属的组织名称'
  }
}

export function getFieldHelp(key: string): FieldHelpEntry | undefined {
  return fieldHelp[key]
}
