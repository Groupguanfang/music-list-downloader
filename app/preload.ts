import * as electron from 'electron'

electron.contextBridge.exposeInMainWorld('electron', {
  request,
})

function request(channel: string, ...args: any[]) {
  return electron.ipcRenderer.invoke(channel, ...args)
}
