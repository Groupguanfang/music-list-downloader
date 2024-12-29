<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { loadLanguageAsync } from '~/modules/i18n'

useHead({ title: '设置 - 网易云音乐下崽器' })
const { locale } = useI18n()
const settingStore = useSettingStore()
const { isElectron } = useEnvironment()
const { proxyRulesInput, setProxy, closeProxy } = useProxy()
</script>

<template>
  <div min-h-screen flex="~ col gap-3">
    <h1 font-size-10 font-bold>{{ $t('setting.title') }}</h1>
    <section>
      <FormLabel mb4 :label="$t('setting.server-manager')" :description="$t('setting.server-manager-desc')" />
      <NDynamicInput v-model:value="settingStore.serverBackends" class="server-dynamic-input" @create="() => ({ name: '', url: '' })">
        <template #default="{ value }">
          <div flex="~ col gap-3" w-full>
            <NInput v-model:value="value.name" :disabled="value.readonly" :placeholder="$t('setting.server-manager-input.name-placeholder')" size="large" />
            <NInput v-model:value="value.url" :disabled="value.readonly" :placeholder="$t('setting.server-manager-input.url-placeholder')" size="large" />
          </div>
        </template>
        <template #action="action">
          <ServerBackendOperation v-bind="action" />
          <NDivider v-if="action.index !== settingStore.serverBackends.length - 1" dashed />
        </template>
      </NDynamicInput>
    </section>
    <NDivider />
    <section v-if="!isElectron">
      <FormLabel mb4 :label="$t('setting.use-internal-download-cookie')" :description="$t('setting.use-internal-download-cookie-desc')" />
      <div flex="~ items-center gap-3">
        <NSwitch v-model:value="settingStore.useInternalDownloadCookie" size="large" />
        <div select-none>{{ settingStore.useInternalDownloadCookie ? $t('common.switch.on') : $t('common.switch.off') }}</div>
      </div>
    </section>
    <NDivider v-if="!isElectron" />
    <section>
      <FormLabel mb4 :label="$t('setting.switch-theme')" :description="$t('setting.switch-theme-desc')" />
      <div flex="~ items-center gap-3">
        <NSwitch :value="isDark" size="large" @click="(e) => toggleDark(!isDark, e)" />
        <div select-none>{{ isDark ? $t('common.switch.on') : $t('common.switch.off') }}</div>
      </div>
    </section>
    <NDivider />
    <section flex="~ items-center justify-between">
      <FormLabel mb4 :label="$t('setting.switch-language')" :description="$t('setting.switch-language-desc')" />
      <div flex="~ items-center gap-3">
        <NSelect
          :options="[
            { label: '简体中文', value: 'zh-CN' },
            { label: 'English', value: 'english' },
          ]"
          :value="locale" size="large" w-auto min-w-40
          @update:value="(v) => loadLanguageAsync(v)"
        />
      </div>
    </section>
    <NDivider />
    <section v-if="isElectron" flex="~ col md:row gap-3 justify-between">
      <FormLabel mb4 :label="$t('setting.proxy')" :description="$t('setting.proxy-desc')" />
      <div flex="~ items-center gap-3">
        <NInput v-model:value="proxyRulesInput" placeholder="http(s)://" size="large" />
        <button class="action-btn" @click="setProxy">设置</button>
        <button class="action-btn" @click="closeProxy">关闭</button>
      </div>
    </section>
  </div>
</template>

<style lang="less">
.server-dynamic-input .n-dynamic-input-item {
  flex-direction: column;
}
</style>
