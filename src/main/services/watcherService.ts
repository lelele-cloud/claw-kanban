import { watch, existsSync, FSWatcher } from 'fs'
import { BrowserWindow } from 'electron'
import { getConfigPath } from '../utils/paths'

let watcher: FSWatcher | null = null

export function startWatching(mainWindow: BrowserWindow): void {
  stopWatching()

  const configPath = getConfigPath()
  if (!existsSync(configPath)) {
    return
  }

  let debounceTimer: NodeJS.Timeout | null = null

  watcher = watch(configPath, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      mainWindow.webContents.send('config:changed')
    }, 300)
  })
}

export function stopWatching(): void {
  if (watcher) {
    watcher.close()
    watcher = null
  }
}
