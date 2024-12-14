import path from 'node:path'
import process from 'node:process'
import { ElectronAdapter } from '@nailyjs/electron'
import { app, BrowserWindow } from 'electron'
import { app as rpc } from '../backend/main'

let __dirname: string = globalThis.__dirname
if (!__dirname)
  __dirname = path.dirname(new URL(import.meta.url).pathname)

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.resolve(decodeURIComponent(__dirname), './preload.cjs'),
    },
  })

  await rpc.setBackendAdapter(ElectronAdapter)
    .getRpcMethodExecutor()
    .setBackendAdapter(rpc.getBackendAdapter() as ElectronAdapter)
    .setup()

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  }
  else {
    win.loadFile(path.join(__dirname, '../dist/frontend/index.html'))
  }
})
