import { ipcMain } from 'electron'
import {
  readSoulMd,
  writeSoulMd,
  listSkills,
  readSkill,
  writeSkill,
  getWorkspaceFiles
} from '../services/workspaceService'

export function registerWorkspaceHandlers(): void {
  ipcMain.handle('workspace:readSoulMd', async () => {
    return readSoulMd()
  })

  ipcMain.handle('workspace:writeSoulMd', async (_event, content: string) => {
    await writeSoulMd(content)
    return { success: true }
  })

  ipcMain.handle('workspace:listSkills', async () => {
    return listSkills()
  })

  ipcMain.handle('workspace:readSkill', async (_event, name: string) => {
    return readSkill(name)
  })

  ipcMain.handle('workspace:writeSkill', async (_event, name: string, content: string) => {
    await writeSkill(name, content)
    return { success: true }
  })

  ipcMain.handle('workspace:listFiles', async () => {
    return getWorkspaceFiles()
  })
}
