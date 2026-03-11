import { ipcMain } from 'electron'
import {
  searchSkills,
  listSkills,
  getSkillDetail,
  getSkillFile,
  installSkill,
  uninstallSkill,
  getInstalledSlugs
} from '../services/clawhubService'

export function registerClawHubHandlers(): void {
  ipcMain.handle(
    'clawhub:search',
    async (_event, query: string, limit?: number) => {
      return searchSkills(query, limit)
    }
  )

  ipcMain.handle(
    'clawhub:list',
    async (_event, sort?: string, limit?: number, cursor?: string) => {
      return listSkills(sort, limit, cursor)
    }
  )

  ipcMain.handle('clawhub:detail', async (_event, slug: string) => {
    return getSkillDetail(slug)
  })

  ipcMain.handle(
    'clawhub:file',
    async (_event, slug: string, path?: string, version?: string) => {
      return getSkillFile(slug, path, version)
    }
  )

  ipcMain.handle(
    'clawhub:install',
    async (_event, slug: string, version?: string) => {
      return installSkill(slug, version)
    }
  )

  ipcMain.handle('clawhub:uninstall', async (_event, slug: string) => {
    await uninstallSkill(slug)
    return { success: true }
  })

  ipcMain.handle('clawhub:installed', async () => {
    return getInstalledSlugs()
  })
}
