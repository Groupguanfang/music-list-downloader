// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    "@bg-dev/nuxt-naiveui",
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@netlify/nuxt'
  ]
})