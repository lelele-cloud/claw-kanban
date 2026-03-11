import { ipcMain, shell } from 'electron'
import { existsSync } from 'fs'
import { homedir } from 'os'
import { getConfigPath, getOpenClawDir } from '../utils/paths'

export function registerSystemHandlers(): void {
  ipcMain.handle('system:homedir', () => {
    return homedir()
  })

  ipcMain.handle('system:configPath', () => {
    return getConfigPath()
  })

  ipcMain.handle('system:openClawDir', () => {
    return getOpenClawDir()
  })

  ipcMain.handle('system:fileExists', (_event, path: string) => {
    return existsSync(path)
  })

  ipcMain.handle('system:openInEditor', (_event, path: string) => {
    shell.openPath(path)
  })

  ipcMain.handle('system:openExternal', (_event, url: string) => {
    shell.openExternal(url)
  })
}
