import type { InvokeFn } from '@nailyjs/electron/rpc'
import * as electron from 'electron'
import { CommunicationChannel } from './channel'

const request: InvokeFn = (channel: string, ...args: any[]) => {
  return electron.ipcRenderer.invoke(channel, ...args)
}

function closeWindow() {
  electron.ipcRenderer.send(CommunicationChannel.CloseWindow)
}

function minimizeWindow() {
  electron.ipcRenderer.send(CommunicationChannel.MinimizeWindow)
}

function maximizeWindow() {
  electron.ipcRenderer.send(CommunicationChannel.MaximizeWindow)
}

function getPlatform(): Promise<NodeJS.Platform> {
  return electron.ipcRenderer.invoke(CommunicationChannel.GetPlatform)
}

electron.contextBridge.exposeInMainWorld('electron' as Exclude<keyof Window, number>, {
  request,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  getPlatform,
} as GlobalElectron)
