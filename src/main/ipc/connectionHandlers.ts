import { ipcMain } from 'electron'
import { testConnection } from '../services/connectionTestService'

export function registerConnectionHandlers(): void {
  ipcMain.handle(
    'connection:test',
    async (_event, type: string, config: Record<string, unknown>) => {
      return testConnection(type, config)
    }
  )
}
