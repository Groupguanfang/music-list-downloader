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

const themeOverridesRef = computed(() => {
  return !isDark.value
    ? themeOverrides[0].value
    : themeOverrides[1].value
})
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverridesRef" :theme="isDark ? darkTheme : null">
    <RouterView>
      <template #default="{ Component }">
        <Transition
          enter-active-class="transition ease-in-out duration-200"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in-out duration-200"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <KeepAlive>
            <Suspense suspensible>
              <component :is="Component" />

              <template #fallback>
                <div fixed top-0 left-0 size-full flex="~ justify-center items-center">
                  <NSpin description="正在加载中..." />
                </div>
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </NConfigProvider>
</template>
