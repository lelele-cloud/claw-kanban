import { ipcMain } from 'electron'
import { readConfig, writeConfig, patchConfig, deleteConfigKey } from '../services/configService'

export function registerConfigHandlers(): void {
  ipcMain.handle('config:read', async () => {
    return readConfig()
  })

  ipcMain.handle('config:write', async (_event, config: Record<string, unknown>) => {
    await writeConfig(config)
    return { success: true }
  })

  ipcMain.handle('config:patch', async (_event, path: string, value: unknown) => {
    return patchConfig(path, value)
  })

  ipcMain.handle('config:delete', async (_event, path: string) => {
    return deleteConfigKey(path)
  })
}
