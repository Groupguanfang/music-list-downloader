import type { InvokeFn } from '@nailyjs/electron/rpc'
import * as electron from 'electron'

const request: InvokeFn = (channel: string, ...args: any[]) => {
  return electron.ipcRenderer.invoke(channel, ...args)
}

electron.contextBridge.exposeInMainWorld('electron' as Exclude<keyof Window, number>, {
  request,
} as GlobalElectron)
