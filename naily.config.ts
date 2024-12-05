import path from 'node:path'
import { defineConfig } from '@nailyjs/config'

export default defineConfig({
  naily: {
    app: {
      internalCookie: 'MUSIC_U',
    },
    typeorm: {
      type: 'sqlite',
      database: path.resolve('./data/naily.db'),
    },
  },
})
