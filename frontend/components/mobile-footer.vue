<script setup lang="tsx">
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const footerButtons = ref([
  {
    icon: 'i-ph-house-duotone',
    onClick: () => router.push('/'),
    selected: computed(() => route.path === '/'),
    label: t('nav.home'),
  },
  {
    icon: 'i-ph-user-circle-duotone',
    onClick: () => router.push('/my'),
    selected: computed(() => route.path === '/my'),
    label: t('nav.personal'),
  },
])
</script>

<template>
  <footer p="3" class="bg-white/80 dark:bg-#210000d6 fixed-footer" flex="~ justify-around">
    <button
      v-for="(footerButton, footerButtonIndex) in footerButtons" :key="footerButtonIndex"
      p="1.5" rounded-1.3 :class="`${footerButton.selected ? 'dark:bg-gray/10' : ''} active:bg-op-30 transition-all duration-300`"
      @click="footerButton.onClick"
    >
      <div text-xl :class="footerButton.icon" />
    </button>
  </footer>
</template>

<style scoped>
.fixed-footer {
  @apply fixed w-full left-0 bottom-0 z-99 backdrop-blur-md transition-all;
}
</style>
