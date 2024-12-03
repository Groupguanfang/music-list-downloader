// backend/main.ts
/// <reference types="vite/client" />

import { env } from 'node:process'
import { NodeAdapter } from '@nailyjs/backend/node-adapter'
import { ConfigPlugin } from '@nailyjs/config'
import { RpcBootstrap } from '@nailyjs/rpc'
import { TypeOrmPlugin } from '@nailyjs/typeorm'
import { getEntities } from './utils/entities'

// Import all configurations
import.meta.glob('./configurations/**/*.configuration.ts', { eager: true })
// Import all controllers
import.meta.glob('./controllers/**/*.controller.ts', { eager: true })

// You must export `app` for the plugin to work.
// you also can configure your export key in the plugin options.
export const app = new RpcBootstrap()
  .setBaseURL('/rpc')
  .setBackendAdapter(NodeAdapter)
  .use(ConfigPlugin())
  .use(TypeOrmPlugin({ entities: getEntities() }))

// It will be called when environment is production mode
if (import.meta.env.PROD && env.NODE_ENV === 'production')
  // eslint-disable-next-line no-console
  app.run(1000).then(() => console.log(`Server is running on http://localhost:1000 in ${app.getBaseURL()}`))
