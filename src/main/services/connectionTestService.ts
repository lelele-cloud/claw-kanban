import https from 'node:https'
import http from 'node:http'

interface TestResult {
  success: boolean
  message: string
  latencyMs?: number
}

const TIMEOUT_MS = 10000

async function httpRequest(
  url: string,
  headers: Record<string, string> = {},
  method = 'GET'
): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const lib = isHttps ? https : http
    const req = lib.request(url, { method, headers, timeout: TIMEOUT_MS }, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => resolve({ statusCode: res.statusCode || 0, body }))
    })
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('请求超时'))
    })
    req.end()
  })
}

async function testAnthropic(apiKey: string, baseUrl?: string): Promise<TestResult> {
  const url = `${baseUrl || 'https://api.anthropic.com'}/v1/models`
  const res = await httpRequest(url, {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01'
  })
  if (res.statusCode === 200) {
    return { success: true, message: 'Anthropic API 连接成功' }
  }
  if (res.statusCode === 401) {
    return { success: false, message: 'API 密钥无效' }
  }
  return { success: false, message: `HTTP ${res.statusCode}: ${res.body.slice(0, 200)}` }
}

async function testOpenAI(apiKey: string, baseUrl?: string): Promise<TestResult> {
  const url = `${baseUrl || 'https://api.openai.com/v1'}/models`
  const res = await httpRequest(url, {
    Authorization: `Bearer ${apiKey}`
  })
  if (res.statusCode === 200) {
    return { success: true, message: 'OpenAI API 连接成功' }
  }
  if (res.statusCode === 401) {
    return { success: false, message: 'API 密钥无效' }
  }
  return { success: false, message: `HTTP ${res.statusCode}: ${res.body.slice(0, 200)}` }
}

async function testGoogle(apiKey: string, baseUrl?: string): Promise<TestResult> {
  const url = `${baseUrl || 'https://generativelanguage.googleapis.com'}/v1beta/models?key=${apiKey}`
  const res = await httpRequest(url)
  if (res.statusCode === 200) {
    return { success: true, message: 'Google AI API 连接成功' }
  }
  if (res.statusCode === 400 || res.statusCode === 403) {
    return { success: false, message: 'API 密钥无效或无权限' }
  }
  return { success: false, message: `HTTP ${res.statusCode}: ${res.body.slice(0, 200)}` }
}

async function testOllama(baseUrl?: string): Promise<TestResult> {
  const url = `${baseUrl || 'http://localhost:11434'}/api/tags`
  const res = await httpRequest(url)
  if (res.statusCode === 200) {
    try {
      const data = JSON.parse(res.body)
      const count = data.models?.length || 0
      return { success: true, message: `Ollama 连接成功，共 ${count} 个模型` }
    } catch {
      return { success: true, message: 'Ollama 连接成功' }
    }
  }
  return { success: false, message: `无法连接 Ollama (${baseUrl || 'localhost:11434'})` }
}

async function testDeepSeek(apiKey: string, baseUrl?: string): Promise<TestResult> {
  const url = `${baseUrl || 'https://api.deepseek.com'}/models`
  const res = await httpRequest(url, {
    Authorization: `Bearer ${apiKey}`
  })
  if (res.statusCode === 200) {
    return { success: true, message: 'DeepSeek API 连接成功' }
  }
  if (res.statusCode === 401) {
    return { success: false, message: 'API 密钥无效' }
  }
  return { success: false, message: `HTTP ${res.statusCode}: ${res.body.slice(0, 200)}` }
}

async function testMistral(apiKey: string, baseUrl?: string): Promise<TestResult> {
  const url = `${baseUrl || 'https://api.mistral.ai'}/v1/models`
  const res = await httpRequest(url, {
    Authorization: `Bearer ${apiKey}`
  })
  if (res.statusCode === 200) {
    return { success: true, message: 'Mistral API 连接成功' }
  }
  if (res.statusCode === 401) {
    return { success: false, message: 'API 密钥无效' }
  }
  return { success: false, message: `HTTP ${res.statusCode}: ${res.body.slice(0, 200)}` }
}

async function testTelegram(token: string): Promise<TestResult> {
  const url = `https://api.telegram.org/bot${token}/getMe`
  const res = await httpRequest(url)
  if (res.statusCode === 200) {
    try {
      const data = JSON.parse(res.body)
      const botName = data.result?.username || 'unknown'
      return { success: true, message: `Telegram Bot @${botName} 连接成功` }
    } catch {
      return { success: true, message: 'Telegram Bot 连接成功' }
    }
  }
  if (res.statusCode === 401) {
    return { success: false, message: 'Bot Token 无效' }
  }
  return { success: false, message: `HTTP ${res.statusCode}: ${res.body.slice(0, 200)}` }
}

async function testDiscord(token: string): Promise<TestResult> {
  const url = 'https://discord.com/api/v10/users/@me'
  const res = await httpRequest(url, {
    Authorization: `Bot ${token}`
  })
  if (res.statusCode === 200) {
    try {
      const data = JSON.parse(res.body)
      return { success: true, message: `Discord Bot ${data.username}#${data.discriminator} 连接成功` }
    } catch {
      return { success: true, message: 'Discord Bot 连接成功' }
    }
  }
  if (res.statusCode === 401) {
    return { success: false, message: 'Bot Token 无效' }
  }
  return { success: false, message: `HTTP ${res.statusCode}: ${res.body.slice(0, 200)}` }
}

async function testSlack(token: string): Promise<TestResult> {
  const url = 'https://slack.com/api/auth.test'
  const res = await httpRequest(url, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }, 'POST')
  if (res.statusCode === 200) {
    try {
      const data = JSON.parse(res.body)
      if (data.ok) {
        return { success: true, message: `Slack Bot (${data.team}) 连接成功` }
      }
      return { success: false, message: `Slack 错误: ${data.error}` }
    } catch {
      return { success: false, message: '无法解析 Slack 响应' }
    }
  }
  return { success: false, message: `HTTP ${res.statusCode}` }
}

export async function testConnection(
  type: string,
  config: Record<string, unknown>
): Promise<TestResult> {
  const start = Date.now()

  try {
    let result: TestResult

    const apiKey = (config.apiKey as string) || ''
    const baseUrl = (config.baseUrl as string) || ''
    const token = (config.token as string) || (config.botToken as string) || ''

    switch (type) {
      case 'anthropic':
        result = await testAnthropic(apiKey, baseUrl || undefined)
        break
      case 'openai':
        result = await testOpenAI(apiKey, baseUrl || undefined)
        break
      case 'google':
        result = await testGoogle(apiKey, baseUrl || undefined)
        break
      case 'ollama':
        result = await testOllama(baseUrl || undefined)
        break
      case 'deepseek':
        result = await testDeepSeek(apiKey, baseUrl || undefined)
        break
      case 'mistral':
        result = await testMistral(apiKey, baseUrl || undefined)
        break
      case 'telegram':
        result = await testTelegram(token)
        break
      case 'discord':
        result = await testDiscord(token)
        break
      case 'slack':
        result = await testSlack(token)
        break
      default:
        result = { success: false, message: `不支持的连接类型: ${type}` }
    }

    result.latencyMs = Date.now() - start
    return result
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知错误'
    return {
      success: false,
      message: `连接失败: ${message}`,
      latencyMs: Date.now() - start
    }
  }
}
