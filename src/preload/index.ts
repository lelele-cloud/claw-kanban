import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Config operations
  config: {
    read: (): Promise<Record<string, unknown>> => ipcRenderer.invoke('config:read'),
    write: (config: Record<string, unknown>): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('config:write', config),
    patch: (path: string, value: unknown): Promise<Record<string, unknown>> =>
      ipcRenderer.invoke('config:patch', path, value),
    delete: (path: string): Promise<Record<string, unknown>> =>
      ipcRenderer.invoke('config:delete', path)
  },

  // Workspace operations
  workspace: {
    readSoulMd: (): Promise<string> => ipcRenderer.invoke('workspace:readSoulMd'),
    writeSoulMd: (content: string): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('workspace:writeSoulMd', content),
    listSkills: (): Promise<Array<{ name: string; path: string; content: string }>> =>
      ipcRenderer.invoke('workspace:listSkills'),
    readSkill: (name: string): Promise<string> => ipcRenderer.invoke('workspace:readSkill', name),
    writeSkill: (name: string, content: string): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('workspace:writeSkill', name, content),
    listFiles: (): Promise<string[]> => ipcRenderer.invoke('workspace:listFiles')
  },

  // System operations
  system: {
    homedir: (): Promise<string> => ipcRenderer.invoke('system:homedir'),
    configPath: (): Promise<string> => ipcRenderer.invoke('system:configPath'),
    openClawDir: (): Promise<string> => ipcRenderer.invoke('system:openClawDir'),
    fileExists: (path: string): Promise<boolean> =>
      ipcRenderer.invoke('system:fileExists', path),
    openInEditor: (path: string): Promise<void> =>
      ipcRenderer.invoke('system:openInEditor', path),
    openExternal: (url: string): Promise<void> =>
      ipcRenderer.invoke('system:openExternal', url)
  },

  // ClawHub marketplace operations
  clawhub: {
    search: (query: string, limit?: number): Promise<unknown[]> =>
      ipcRenderer.invoke('clawhub:search', query, limit),
    list: (sort?: string, limit?: number, cursor?: string): Promise<{ skills: unknown[]; nextCursor?: string }> =>
      ipcRenderer.invoke('clawhub:list', sort, limit, cursor),
    detail: (slug: string): Promise<unknown> =>
      ipcRenderer.invoke('clawhub:detail', slug),
    file: (slug: string, path?: string, version?: string): Promise<string> =>
      ipcRenderer.invoke('clawhub:file', slug, path, version),
    install: (slug: string, version?: string): Promise<{ path: string }> =>
      ipcRenderer.invoke('clawhub:install', slug, version),
    uninstall: (slug: string): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('clawhub:uninstall', slug),
    installed: (): Promise<string[]> =>
      ipcRenderer.invoke('clawhub:installed')
  },

  // Event listeners
  onConfigChanged: (callback: () => void): (() => void) => {
    const handler = (): void => callback()
    ipcRenderer.on('config:changed', handler)
    return () => ipcRenderer.removeListener('config:changed', handler)
  }
}

contextBridge.exposeInMainWorld('api', api)
