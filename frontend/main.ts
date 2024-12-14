import type { UserModule } from './types'
import { isClient } from '@vueuse/core'

import { setupLayouts } from 'virtual:generated-layouts'
import { RouterOptions, ViteSSG } from 'vite-ssg'

import { createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/theme.css'
import 'uno.css'

function getRouterOptions(): RouterOptions {
  if (!__IS_SSG__ && isClient) {
    return {
      history: createWebHashHistory(import.meta.env.BASE_URL),
      routes: setupLayouts(routes),
      base: import.meta.env.BASE_URL,
      scrollBehavior: () => ({
        top: 0,
        left: 0,
      }),
    }
  }

  return {
    routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL,
    scrollBehavior: () => ({
      top: 0,
      left: 0,
    }),
  }
}

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  getRouterOptions(),
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))

    Object.values(import.meta.glob<{ install: UserModule }>('./directives/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)
