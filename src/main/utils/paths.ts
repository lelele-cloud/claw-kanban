import { homedir } from 'os'
import { join } from 'path'

export function getOpenClawDir(): string {
  return join(homedir(), '.openclaw')
}

export function getConfigPath(): string {
  return join(getOpenClawDir(), 'openclaw.json')
}

export function getWorkspaceDir(): string {
  return join(getOpenClawDir(), 'agents', 'main')
}

export function getSkillsDir(): string {
  return join(getOpenClawDir(), 'skills')
}

export function getSoulMdPath(): string {
  return join(getWorkspaceDir(), 'SOUL.md')
}
