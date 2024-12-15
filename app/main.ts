import path from 'node:path'
import process from 'node:process'
import { ElectronAdapter } from '@nailyjs/electron'
import { app, BrowserWindow, Menu } from 'electron'
import { app as rpc } from '../backend/main'
import { version } from '../package.json'

let __dirname: string = globalThis.__dirname
if (!__dirname)
  __dirname = path.dirname(new URL(import.meta.url).pathname)

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    webPreferences: {
      preload: path.resolve(decodeURIComponent(__dirname), './preload.cjs'),
    },
  })

  app.setAboutPanelOptions({
    applicationName: '网易云音乐下崽器',
    applicationVersion: version,
    authors: ['Naily Zero <zero@naily.cc> (https://naily.cc)'],
    version,
  })

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: '网易云音乐下崽器',
        submenu: [
          {
            label: '关于',
            role: 'about',
          },
          {
            label: '开发者选项',
            submenu: [
              {
                label: '开发者工具',
                role: 'toggleDevTools',
              },
              {
                label: '重新加载',
                role: 'reload',
              },
              {
                label: '强制重新加载',
                role: 'forceReload',
              },
            ],
          },
          {
            label: '退出',
            role: 'quit',
          },
        ],
      },
    ]),
  )

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
