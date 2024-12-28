import type { InvokeFn } from '@nailyjs/electron/rpc'
import * as electron from 'electron'

const request: InvokeFn = (channel: string, ...args: any[]) => {
  return electron.ipcRenderer.invoke(channel, ...args)
}

function closeWindow() {
  electron.ipcRenderer.send('mld:close-window')
}

function minimizeWindow() {
  electron.ipcRenderer.send('mld:minimize-window')
}

function maximizeWindow() {
  electron.ipcRenderer.send('mld:maximize-window')
}

function getPlatform(): Promise<NodeJS.Platform> {
  return electron.ipcRenderer.invoke('mld:get-platform')
}

electron.contextBridge.exposeInMainWorld('electron' as Exclude<keyof Window, number>, {
  request,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  getPlatform,
} as GlobalElectron)
