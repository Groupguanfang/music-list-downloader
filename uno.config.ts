import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    [
      'btn',
      'px-5 py-2 rounded-md inline-block cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    ],
    [
      'action-btn',
      'btn p3 md:px-5 md:py-2 flex! items-center gap-1 hover:scale-105 active:scale-95 transition-all text-nowrap bg-red-5 color-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none!',
    ],
  ],
  rules: [
    [
      'app-drag',
      { '-webkit-app-region': 'drag' },
    ],
    [
      'app-no-drag',
      { '-webkit-app-region': 'no-drag' },
    ],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|ts|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/],
    },
  },
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
