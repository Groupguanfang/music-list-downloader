<script setup lang="ts">
const result = useLocalStorage('__naily:music-downloader-setting__', {
  useInternalDownloadCookie: false,
})
</script>

<template>
  <div pt-10 min-h-screen>
    <section>
      <FormLabel mb4 :label="$t('setting.useInternalDownloadCookie')" :description="$t('setting.useInternalDownloadCookieDesc')" />
      <div flex="~ items-center gap-3">
        <NSwitch v-model:value="result.useInternalDownloadCookie" size="large" />
        <div>{{ result.useInternalDownloadCookie ? $t('common.switch.on') : $t('common.switch.off') }}</div>
      </div>
    </section>
  </div>
</template>
