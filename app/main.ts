import path from 'node:path'
import process from 'node:process'
import { ElectronAdapter } from '@nailyjs/electron'
import { app, BrowserWindow, Menu } from 'electron'
import { load } from 'js-yaml'
import { get } from 'lodash-es'
import { app as rpc } from '../backend/main'
import config from '../config.yml?raw'
import { author, productName, version } from '../package.json'
import { CommunicationChannel } from './channel'
import { defineChannel } from './impl'

let __dirname: string = globalThis.__dirname
if (!__dirname)
  __dirname = path.dirname(new URL(import.meta.url).pathname)

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    frame: false,
    webPreferences: {
      preload: path.resolve(decodeURIComponent(__dirname), './preload.cjs'),
      // 关闭web安全策略，让前端完全掌控下载内容
      webSecurity: false,
    },
  })

  defineChannel({
    [CommunicationChannel.CloseWindow]: {
      type: 'on',
      handler: () => win.close(),
    },
    [CommunicationChannel.MinimizeWindow]: {
      type: 'on',
      handler: () => win.minimize(),
    },
    [CommunicationChannel.MaximizeWindow]: {
      type: 'on',
      handler: () => win.maximize(),
    },
    [CommunicationChannel.GetPlatform]: {
      type: 'invoke',
      handler: () => process.platform,
    },
  })

  app.setAboutPanelOptions({
    applicationName: productName,
    applicationVersion: version,
    authors: [author],
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

  // 设置naily后端适配器为 Electron
  const executor = rpc.setBackendAdapter(ElectronAdapter)
  const electronAdapter = rpc.getBackendAdapter() as ElectronAdapter
  electronAdapter.setHandlerToken(get(load(config), 'handlerToken', CommunicationChannel.RPC))

  executor.setBackendAdapter(electronAdapter)
    .getRpcMethodExecutor()
    .setBackendAdapter(rpc.getBackendAdapter() as ElectronAdapter)
    .setup()

  if (process.env.VITE_DEV_SERVER_URL)
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  else
    win.loadFile(path.join(__dirname, '../dist/frontend/index.html'))
})
