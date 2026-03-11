import { readFile, writeFile, readdir, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { getSoulMdPath, getSkillsDir, getWorkspaceDir } from '../utils/paths'

export async function readSoulMd(): Promise<string> {
  const path = getSoulMdPath()
  if (!existsSync(path)) {
    return ''
  }
  return readFile(path, 'utf-8')
}

export async function writeSoulMd(content: string): Promise<void> {
  const path = getSoulMdPath()
  const dir = dirname(path)
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
  await writeFile(path, content, 'utf-8')
}

export interface SkillInfo {
  name: string
  path: string
  content: string
}

export async function listSkills(): Promise<SkillInfo[]> {
  const skillsDir = getSkillsDir()
  if (!existsSync(skillsDir)) {
    return []
  }

  const entries = await readdir(skillsDir, { withFileTypes: true })
  const skills: SkillInfo[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillMdPath = join(skillsDir, entry.name, 'SKILL.md')
      if (existsSync(skillMdPath)) {
        const content = await readFile(skillMdPath, 'utf-8')
        skills.push({
          name: entry.name,
          path: skillMdPath,
          content
        })
      }
    }
  }

  return skills
}

export async function readSkill(name: string): Promise<string> {
  const skillPath = join(getSkillsDir(), name, 'SKILL.md')
  if (!existsSync(skillPath)) {
    return ''
  }
  return readFile(skillPath, 'utf-8')
}

export async function writeSkill(name: string, content: string): Promise<void> {
  const skillDir = join(getSkillsDir(), name)
  if (!existsSync(skillDir)) {
    await mkdir(skillDir, { recursive: true })
  }
  await writeFile(join(skillDir, 'SKILL.md'), content, 'utf-8')
}

export async function getWorkspaceFiles(): Promise<string[]> {
  const wsDir = getWorkspaceDir()
  if (!existsSync(wsDir)) {
    return []
  }
  const entries = await readdir(wsDir)
  return entries.filter((e) => e.endsWith('.md'))
}
