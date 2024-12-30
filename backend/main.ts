// backend/main.ts
/// <reference types="vite/client" />

import console from 'node:console'
import { env } from 'node:process'
import { NodeAdapter } from '@nailyjs/backend/node-adapter'
import { ConfigPlugin } from '@nailyjs/config'
import { RpcBootstrap } from '@nailyjs/rpc'
import { load } from 'js-yaml'
import { get } from 'lodash-es'
import config from '../config.yml?raw'

// Import all controllers
import.meta.glob('./controllers/**/*.controller.ts', { eager: true })
// Import all filters
import.meta.glob('./errors/**/*.filter.ts', { eager: true })

const result: any = load(config || '')

// You must export `app` for the plugin to work.
// you also can configure your export key in the plugin options.
export const app = new RpcBootstrap()
  .setBaseURL(get(result, 'internalServer.baseURL', '/_api'))
  .setBackendAdapter(NodeAdapter)
  .use(ConfigPlugin())

// It will be called when environment is production mode
if (import.meta.env.PROD && env.NODE_ENV === 'production') {
  const port = env.PORT ? Number(env.PORT) : 1000
  app.run(port).then(() => console.log(`Server is running on http://localhost:${port} in ${app.getBaseURL()}`))
}
