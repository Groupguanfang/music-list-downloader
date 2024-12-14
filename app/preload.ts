import * as electron from 'electron'

electron.contextBridge.exposeInMainWorld('isElectron', true)

electron.contextBridge.exposeInMainWorld('electron', {
  request: async (channel: string, ...args: any[]) => {
    console.warn('来自渲染进程的消息', channel, args)
    const result = await electron.ipcRenderer.invoke(channel, ...args)
    console.warn('来自主进程的消息', result)
    return result
  },
})
