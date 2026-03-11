import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { dirname } from 'path'
import JSON5 from 'json5'
import { getConfigPath } from '../utils/paths'

export async function readConfig(): Promise<Record<string, unknown>> {
  const configPath = getConfigPath()
  if (!existsSync(configPath)) {
    return {}
  }
  const content = await readFile(configPath, 'utf-8')
  return JSON5.parse(content)
}

export async function writeConfig(config: Record<string, unknown>): Promise<void> {
  const configPath = getConfigPath()
  const dir = dirname(configPath)
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
  const content = JSON.stringify(config, null, 2)
  await writeFile(configPath, content, 'utf-8')
}

export async function patchConfig(
  path: string,
  value: unknown
): Promise<Record<string, unknown>> {
  const config = await readConfig()
  const keys = path.split('.')
  let current: Record<string, unknown> = config

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  const lastKey = keys[keys.length - 1]
  if (value === undefined || value === null) {
    delete current[lastKey]
  } else {
    current[lastKey] = value
  }

  await writeConfig(config)
  return config
}

export async function deleteConfigKey(path: string): Promise<Record<string, unknown>> {
  return patchConfig(path, undefined)
}
