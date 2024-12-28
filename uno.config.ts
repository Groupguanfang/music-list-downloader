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
