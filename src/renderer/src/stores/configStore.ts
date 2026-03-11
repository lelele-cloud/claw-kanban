import { create } from 'zustand'
import type { OpenClawConfig } from '../types/config'

interface ConfigState {
  config: OpenClawConfig
  loading: boolean
  error: string | null
  configPath: string | null
  soulMd: string
  skills: Array<{ name: string; path: string; content: string }>

  loadConfig: () => Promise<void>
  saveConfig: (config: OpenClawConfig) => Promise<void>
  patchConfig: (path: string, value: unknown) => Promise<void>

  loadSoulMd: () => Promise<void>
  saveSoulMd: (content: string) => Promise<void>

  loadSkills: () => Promise<void>
  saveSkill: (name: string, content: string) => Promise<void>
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: {},
  loading: false,
  error: null,
  configPath: null,
  soulMd: '',
  skills: [],

  loadConfig: async () => {
    set({ loading: true, error: null })
    try {
      const [config, configPath] = await Promise.all([
        window.api.config.read(),
        window.api.system.configPath()
      ])
      set({ config: config as OpenClawConfig, configPath, loading: false })
    } catch (err) {
      set({ error: String(err), loading: false })
    }
  },

  saveConfig: async (config: OpenClawConfig) => {
    try {
      await window.api.config.write(config as Record<string, unknown>)
      set({ config })
    } catch (err) {
      set({ error: String(err) })
    }
  },

  patchConfig: async (path: string, value: unknown) => {
    try {
      const updated = await window.api.config.patch(path, value)
      set({ config: updated as OpenClawConfig })
    } catch (err) {
      set({ error: String(err) })
    }
  },

  loadSoulMd: async () => {
    try {
      const soulMd = await window.api.workspace.readSoulMd()
      set({ soulMd })
    } catch (err) {
      set({ error: String(err) })
    }
  },

  saveSoulMd: async (content: string) => {
    try {
      await window.api.workspace.writeSoulMd(content)
      set({ soulMd: content })
    } catch (err) {
      set({ error: String(err) })
    }
  },

  loadSkills: async () => {
    try {
      const skills = await window.api.workspace.listSkills()
      set({ skills })
    } catch (err) {
      set({ error: String(err) })
    }
  },

  saveSkill: async (name: string, content: string) => {
    try {
      await window.api.workspace.writeSkill(name, content)
      const { skills } = get()
      const idx = skills.findIndex((s) => s.name === name)
      if (idx >= 0) {
        const updated = [...skills]
        updated[idx] = { ...updated[idx], content }
        set({ skills: updated })
      } else {
        set({ skills: [...skills, { name, path: '', content }] })
      }
    } catch (err) {
      set({ error: String(err) })
    }
  }
}))
