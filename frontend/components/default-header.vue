<script setup lang="ts">
import { RouteNamedMap } from 'vue-router/auto-routes'

const { t } = useI18n()
const { y } = useWindowScroll()
const { toggleLocales } = useToggleLocale()
const route = useRoute()

interface NavItem {
  icon: string
  text: string
  to: keyof RouteNamedMap | (string & {})
  showMobile?: boolean
}

const nav = computed((): NavItem[] => ([
  { icon: 'i-ph-house-duotone', text: t('nav.home'), to: '/' },
  { icon: 'i-ph-user-circle-duotone', text: t('nav.personal'), to: '/my' },
  { icon: 'i-ph-sliders-horizontal-duotone', text: t('nav.setting'), to: '/setting' },
]))
const currentLocation = computed(() => nav.value.find(item => item.to === route.name))

const leftButton = computed(() => [
  {
    icon: 'i-ph-music-note-duotone',
    text: t('nav.music-player'),
    onClick: () => void 0,
  },
])
const rightButton = computed(() => [
  {
    icon: isDark.value ? 'i-ph-moon-duotone' : 'i-ph-sun-duotone',
    text: t('nav.switch-theme'),
    onClick: (e: MouseEvent) => toggleDark(!isDark.value, e),
  },
  {
    icon: 'i-ph-translate-duotone',
    text: t('nav.switch-language'),
    onClick: () => toggleLocales(),
  },
])
</script>

<template>
  <header :class="`${y > 50 ? 'bg-white/80 dark:bg-black/80' : ''} fixed-header`">
    <nav flex="~ items-center justify-center gap-2">
      <button
        v-for="(item, index) in nav" :key="index" transition-all btn p3 font-size-4 scale="active:95 hover:101"
        :class="`hover:bg-gray/20 active:bg-gray/15 ${item.to === currentLocation?.to ? 'bg-gray/10' : ''}`"
        flex="~ items-center gap-1" @click="$router.push(item.to)"
      >
        <div :class="item.icon" text-size-lg />
        <div text-size-sm :class="item.to === currentLocation?.to ? '' : 'hidden'">
          {{ item.text }}
        </div>
      </button>
    </nav>

    <div px="3 md:6 lg:14" absolute pointer-events-none size-full flex="~ items-center justify-between" class="top-0">
      <div flex="~ gap-4">
        <NTooltip v-for="(item, index) in leftButton" :key="index">
          {{ item.text }}
          <template #trigger>
            <button
              class="pointer-events-auto! hover:bg-gray/20 active:bg-gray/15" rounded-full transition-all btn
              p="2.5" font-size-4 @click="item.onClick"
            >
              <div :class="item.icon" />
            </button>
          </template>
        </NTooltip>
      </div>
      <div flex="~ gap-1">
        <NTooltip v-for="(item, index) in rightButton" :key="index">
          {{ item.text }}
          <template #trigger>
            <button
              class="pointer-events-auto! hover:bg-gray/20 active:bg-gray/15"
              rounded-full transition-all btn p="2.5" font-size-4 @click="item.onClick"
            >
              <div :class="item.icon" />
            </button>
          </template>
        </NTooltip>
      </div>
    </div>
  </header>
</template>

<style scoped>
.fixed-header {
  @apply fixed w-full left-0 top-0 z-99 py2 backdrop-blur-md transition-all;
}

header {
  background-image: linear-gradient(0deg, rgba(255, 255, 255, 0), #ff00002b);
}
</style>
