interface SkillInfo {
  name: string
  path: string
  content: string
}

interface ClawHubSkill {
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

interface ClawHubListResult {
  skills: ClawHubSkill[]
  nextCursor?: string
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
  clawhub: {
    search(query: string, limit?: number): Promise<ClawHubSkill[]>
    list(sort?: string, limit?: number, cursor?: string): Promise<ClawHubListResult>
    detail(slug: string): Promise<ClawHubSkill>
    file(slug: string, path?: string, version?: string): Promise<string>
    install(slug: string, version?: string): Promise<{ path: string }>
    uninstall(slug: string): Promise<{ success: boolean }>
    installed(): Promise<string[]>
  }
  connection: {
    test(
      type: string,
      config: Record<string, unknown>
    ): Promise<{ success: boolean; message: string; latencyMs?: number }>
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
