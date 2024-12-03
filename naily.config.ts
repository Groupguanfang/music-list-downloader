import path from 'node:path'
import { defineConfig } from '@nailyjs/config'

export default defineConfig({
  naily: {
    typeorm: {
      type: 'sqlite',
      database: path.resolve('./data/naily.db'),
    },
  },
})
