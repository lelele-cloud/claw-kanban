interface SkillInfo {
  name: string
  path: string
  content: string
}

interface ClawApi {
  config: {
    read(): Promise<Record<string, unknown>>
    write(config: Record<string, unknown>): Promise<{ success: boolean }>
    patch(path: string, value: unknown): Promise<Record<string, unknown>>
    delete(path: string): Promise<Record<string, unknown>>
  }
  workspace: {
    readSoulMd(): Promise<string>
    writeSoulMd(content: string): Promise<{ success: boolean }>
    listSkills(): Promise<SkillInfo[]>
    readSkill(name: string): Promise<string>
    writeSkill(name: string, content: string): Promise<{ success: boolean }>
    listFiles(): Promise<string[]>
  }
  system: {
    homedir(): Promise<string>
    configPath(): Promise<string>
    openClawDir(): Promise<string>
    fileExists(path: string): Promise<boolean>
    openInEditor(path: string): Promise<void>
    openExternal(url: string): Promise<void>
  }
  onConfigChanged(callback: () => void): () => void
}

declare global {
  interface Window {
    api: ClawApi
  }
}
