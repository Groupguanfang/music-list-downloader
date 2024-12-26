/* eslint-disable eslint-comments/no-unlimited-disable */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { setup } from '@css-render/vue3-ssr'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Shiki from '@shikijs/markdown-it'
import Vue from '@vitejs/plugin-vue'
import { load } from 'js-yaml'
import { get } from 'lodash-es'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { buildServer, defaultSwcOptions, swc } from 'unplugin-rpc'
import NailyRpc from 'unplugin-rpc/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import Electron from 'vite-plugin-electron'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import WebfontDownload from 'vite-plugin-webfont-dl'
import generateSitemap from 'vite-ssg-sitemap'
import { dependencies } from './package.json'

const config = load(
  fs.existsSync(path.resolve('config.yml')) ? fs.readFileSync(path.resolve('config.yml'), 'utf-8') : '',
)

export default defineConfig((env) => {
  if (env.command === 'build')
    console.log('Current mode:', (env.command === 'build' && process.argv[1].includes('vite-ssg')) ? 'Building SSG' : 'Building Electron')
  else
    console.log('Current mode:', `Serving ${env.command === 'serve' ? 'SSG' : 'Electron'}`)
  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'frontend')}/`,
        '#/': `${path.resolve(__dirname, 'common')}/`,
        '@/': `${path.resolve(__dirname, 'backend')}/`,
      },
    },

    define: {
      __IS_SSG__: !!((env.command === 'build' && process.argv[0] === 'vite-ssg')),
    },

    build: {
      outDir: './dist/frontend',
    },

    // Disable esbuild when using swc
    esbuild: false as const,

    plugins: [
      // https://github.com/nailyjs/core
      NailyRpc({
        build: {
          on: false,
        },

        preview: {
          baseURL: get(config, 'internalServer.baseURL', '/_api'),
        },
      }),

      // Internal swc plugin, fork from https://github.com/unplugin/unplugin-swc
      // - esbuild doesn't support `emitDecoratorMetadata` to reflect types in runtime, so we need it
      // - unplugin-swc has some problems to import, so we forked it and buildin to the rpc plugin
      swc.vite(defaultSwcOptions),

      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
          }),
        },
      }),

      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        extensions: ['.vue', '.md'],
        dts: './types/typed-router.d.ts',
        routesFolder: './frontend/pages',
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts({
        layoutsDirs: './frontend/layouts',
        pagesDirs: './frontend/pages',
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          '@vueuse/head',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            'vue-router/auto': ['useLink'],
          },
        ],
        dts: './types/auto-imports.d.ts',
        dirs: [
          './frontend/composables',
          './frontend/stores',
          './frontend/directives',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: './types/components.d.ts',
        dirs: [
          './frontend/components',
        ],
        resolvers: [NaiveUiResolver()],
      }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),

      // https://github.com/unplugin/unplugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left',
        headEnabled: true,
        async markdownItSetup(md) {
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
          md.use(await Shiki({
            defaultColor: false,
            themes: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
          }))
        },
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
        manifest: {
          name: 'Vitesse',
          short_name: 'Vitesse',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),

      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),

      // eslint-disable-next-line
      process.env.ELECTRON ? Electron([
        {
          entry: './app/main.ts',
          vite: {
            resolve: {
              alias: {
                '~/': `${path.resolve(__dirname, 'frontend')}/`,
                '#/': `${path.resolve(__dirname, 'common')}/`,
                '@/': `${path.resolve(__dirname, 'backend')}/`,
              },
            },

            plugins: [
              swc.vite(defaultSwcOptions),
            ],

            esbuild: false,

            build: {
              ssr: true,
              rollupOptions: {
                external: Object.keys(dependencies).filter(i => i.startsWith('@nailyjs')),
              },
            },
          },
        },
        {
          entry: './app/preload.ts',
          vite: {
            plugins: [
              swc.vite(defaultSwcOptions),
            ],

            esbuild: false,

            build: {
              minify: true,
              sourcemap: false,
              lib: {
                entry: './app/preload.ts',
                fileName: 'preload',
                formats: ['cjs'],
              },
            },
          },
        },
      ]) : undefined,
    ].filter(Boolean),

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async' as const,
      formatting: 'minify' as const,
      crittersOptions: {
        reduceInlineStyles: false,
      },
      entry: './frontend/main.ts',
      async onFinished() {
        await buildServer()
        generateSitemap({ outDir: './dist/frontend' })
      },
      async onBeforePageRender(_, __, appCtx) {
        const { collect } = setup(appCtx.app)
        ;(appCtx as any).__collectStyle = collect
        return undefined
      },
      async onPageRendered(_, renderedHTML, appCtx) {
        const collectedStyle = (appCtx as any).__collectStyle()
        return renderedHTML.replace(
          /<\/body>/,
          `${collectedStyle}</body>`,
        )
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: [
        'workbox-window',
        /vue-i18n/,
        'naive-ui',
        'vueuc',
        'date-fns',
        'pinia-plugin-persistedstate',
      ],
    },
  }
})
