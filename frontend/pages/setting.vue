<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { loadLanguageAsync } from '~/modules/i18n'

const { locale } = useI18n()

const settingStore = useSettingStore()
</script>

<template>
  <div pt-10 min-h-screen flex="~ col gap-3">
    <section>
      <FormLabel mb4 :label="$t('setting.use-internal-download-cookie')" :description="$t('setting.use-internal-download-cookie-desc')" />
      <div flex="~ items-center gap-3">
        <NSwitch v-model:value="settingStore.useInternalDownloadCookie" size="large" />
        <div select-none>
          {{ settingStore.useInternalDownloadCookie ? $t('common.switch.on') : $t('common.switch.off') }}
        </div>
      </div>
    </section>
    <NDivider />
    <section>
      <FormLabel mb4 :label="$t('setting.switch-theme')" :description="$t('setting.switch-theme-desc')" />
      <div flex="~ items-center gap-3">
        <NSwitch :value="isDark" size="large" @click="(e) => toggleDark(!isDark, e)" />
        <div select-none>
          {{ isDark ? $t('common.switch.on') : $t('common.switch.off') }}
        </div>
      </div>
    </section>
    <NDivider />
    <section flex="~ items-center justify-between">
      <FormLabel mb4 :label="$t('setting.switch-language')" :description="$t('setting.switch-language-desc')" />
      <div flex="~ items-center gap-3">
        <NSelect
          :value="locale"
          size="large"
          w-auto min-w-40
          :options="[
            { label: '简体中文', value: 'zh-CN' },
            { label: 'English', value: 'english' },
          ]"
          @update:value="(v) => loadLanguageAsync(v)"
        />
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
section {

}
</style>
