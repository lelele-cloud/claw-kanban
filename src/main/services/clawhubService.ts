import { net } from 'electron'
import { mkdir, writeFile, rm } from 'fs/promises'
import { existsSync, createWriteStream } from 'fs'
import { join } from 'path'
import { getSkillsDir } from '../utils/paths'

const CLAWHUB_API = 'https://clawhub.ai'

export interface ClawHubSkill {
  slug: string
  name: string
  description: string
  owner: { handle: string }
  downloads?: number
  installs?: number
  installsAllTime?: number
  stars?: number
  rating?: number
  version?: string
  updatedAt?: string
  createdAt?: string
  highlighted?: boolean
  metadata?: {
    openclaw?: {
      emoji?: string
      homepage?: string
      os?: string[]
      primaryEnv?: string
      requires?: {
        env?: string[]
        bins?: string[]
        anyBins?: string[]
      }
    }
  }
}

export interface ClawHubSearchResult {
  results: ClawHubSkill[]
}

export interface ClawHubListResult {
  skills: ClawHubSkill[]
  nextCursor?: string
}

export interface ClawHubSkillDetail extends ClawHubSkill {
  versions?: Array<{ version: string; createdAt: string }>
}

async function fetchJson<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = net.request(`${CLAWHUB_API}${path}`)
    let body = ''

    request.on('response', (response) => {
      if (response.statusCode !== 200) {
        response.on('data', (chunk) => {
          body += chunk.toString()
        })
        response.on('end', () => {
          reject(new Error(`ClawHub API error ${response.statusCode}: ${body}`))
        })
        return
      }
      response.on('data', (chunk) => {
        body += chunk.toString()
      })
      response.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch (err) {
          reject(new Error(`Failed to parse ClawHub response: ${err}`))
        }
      })
    })

    request.on('error', (err) => {
      reject(new Error(`ClawHub network error: ${err.message}`))
    })

    request.end()
  })
}

async function fetchBuffer(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const request = net.request(`${CLAWHUB_API}${path}`)
    const chunks: Buffer[] = []

    request.on('response', (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`ClawHub download error: ${response.statusCode}`))
        return
      }
      response.on('data', (chunk) => {
        chunks.push(chunk as Buffer)
      })
      response.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })

    request.on('error', (err) => {
      reject(new Error(`ClawHub network error: ${err.message}`))
    })

    request.end()
  })
}

export async function searchSkills(query: string, limit = 20): Promise<ClawHubSkill[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  const result = await fetchJson<ClawHubSearchResult>(`/api/v1/search?${params}`)
  return result.results || []
}

export async function listSkills(
  sort: string = 'installs',
  limit = 30,
  cursor?: string
): Promise<ClawHubListResult> {
  const params = new URLSearchParams({ sort, limit: String(limit) })
  if (cursor) params.set('cursor', cursor)
  return fetchJson<ClawHubListResult>(`/api/v1/skills?${params}`)
}

export async function getSkillDetail(slug: string): Promise<ClawHubSkillDetail> {
  return fetchJson<ClawHubSkillDetail>(`/api/v1/skills/${encodeURIComponent(slug)}`)
}

export async function getSkillFile(
  slug: string,
  path = 'SKILL.md',
  version?: string
): Promise<string> {
  const params = new URLSearchParams({ path })
  if (version) params.set('version', version)
  return new Promise((resolve, reject) => {
    const request = net.request(
      `${CLAWHUB_API}/api/v1/skills/${encodeURIComponent(slug)}/file?${params}`
    )
    let body = ''

    request.on('response', (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch skill file: ${response.statusCode}`))
        return
      }
      response.on('data', (chunk) => {
        body += chunk.toString()
      })
      response.on('end', () => {
        resolve(body)
      })
    })

    request.on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`))
    })

    request.end()
  })
}

export async function installSkill(slug: string, version?: string): Promise<{ path: string }> {
  const skillsDir = getSkillsDir()

  // Fetch the SKILL.md content
  const skillMd = await getSkillFile(slug, 'SKILL.md', version)

  // Create the skill directory
  const skillDir = join(skillsDir, slug)
  if (!existsSync(skillsDir)) {
    await mkdir(skillsDir, { recursive: true })
  }
  if (!existsSync(skillDir)) {
    await mkdir(skillDir, { recursive: true })
  }

  // Write SKILL.md
  await writeFile(join(skillDir, 'SKILL.md'), skillMd, 'utf-8')

  // Write origin metadata
  const originDir = join(skillDir, '.clawhub')
  if (!existsSync(originDir)) {
    await mkdir(originDir, { recursive: true })
  }
  await writeFile(
    join(originDir, 'origin.json'),
    JSON.stringify(
      {
        registry: CLAWHUB_API,
        slug,
        version: version || 'latest',
        installedAt: new Date().toISOString()
      },
      null,
      2
    ),
    'utf-8'
  )

  return { path: skillDir }
}

export async function uninstallSkill(slug: string): Promise<void> {
  const skillDir = join(getSkillsDir(), slug)
  if (existsSync(skillDir)) {
    await rm(skillDir, { recursive: true, force: true })
  }
}

export async function getInstalledSlugs(): Promise<string[]> {
  const { readdir } = await import('fs/promises')
  const skillsDir = getSkillsDir()
  if (!existsSync(skillsDir)) return []

  const entries = await readdir(skillsDir, { withFileTypes: true })
  const slugs: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const originPath = join(skillsDir, entry.name, '.clawhub', 'origin.json')
      if (existsSync(originPath)) {
        slugs.push(entry.name)
      }
    }
  }

  return slugs
}
