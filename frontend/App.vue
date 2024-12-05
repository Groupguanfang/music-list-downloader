<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import themeOverrides from './styles/theme-overrides'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: '网易云音乐下崽器',
  meta: [
    {
      name: 'description',
      content: 'Opinionated Vite Starter Template',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides" :theme="isDark ? darkTheme : null">
    <RouterView />
  </NConfigProvider>
</template>
