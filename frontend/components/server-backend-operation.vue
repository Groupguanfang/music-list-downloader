<script setup lang="tsx">
import axios, { AxiosResponse } from 'axios'
import { useMessage } from 'naive-ui'
import { match } from 'ts-pattern'
import { randomId } from '~/utils/random'

const props = defineProps<{
  index: number
  create: (index: number) => void
  remove: (index: number) => void
  move: (direction: 'up' | 'down', index: number) => void
}>()
const message = useMessage()
const { t } = useI18n()
const settingStore = useSettingStore()

const currentServerBackend = computed(() =>
  (settingStore.serverBackends.find(serverBackend => serverBackend.id === settingStore.currentServerBackend) || {}).id
  === settingStore.serverBackends[props.index].id,
)

const checking = ref(false)
async function setCurrentServerBackend(index: number) {
  const serverBackend = settingStore.serverBackends[index]
  if (!serverBackend)
    return message.error(t('setting.server-manager-message.no-exist'))
  if (!serverBackend.url)
    return message.error(t('setting.server-manager-message.address-empty'))
  if (!serverBackend.name)
    return message.error(t('setting.server-manager-message.name-empty'))

  checking.value = true
  await Promise.allSettled([
    axios.post(serverBackend.url, {
      jsonrpc: '2.0',
      id: randomId(),
      method: 'MusicController.getVersion',
    }),
    new Promise(resolve => setTimeout(resolve, 1000)),
  ])
    .then(([res]) => match(res.status).with('fulfilled', () => {
      const result = res as PromiseFulfilledResult<AxiosResponse>
      if (result.value.data.error
        || !result.value.data.result
        || typeof result.value.data.result !== 'object'
        || typeof result.value.data.result.version !== 'string') {
        return message.error('服务器信息返回错误，请检查地址是否正确')
      }
      message.success(t('setting.server-manager-message.connected', { version: result.value.data.result.version }))
      settingStore.currentServerBackend = serverBackend.id
    }).with('rejected', () => message.error('无法连接到服务器')))
    .catch(() => message.error('无法连接到服务器'))
    .finally(() => checking.value = false)
}

function removeServerBackend(index: number) {
  const serverBackend = settingStore.serverBackends[index] || {}
  if (serverBackend.readonly === true)
    return message.error('无法删除默认服务器')
  if (serverBackend.id === settingStore.currentServerBackend)
    return message.error('无法删除当前正在使用的服务器, 请先切换服务器')

  props.remove(index)
}
</script>

<template>
  <div flex="~ col md:row justify-between md:items-center" my-3>
    <div flex="~ wrap gap-2 md:gap-3">
      <button class="action-btn" @click="create(index)">
        {{ $t('setting.server-manager-action.add') }}
      </button>
      <button class="action-btn" @click="removeServerBackend(index)">
        {{ $t('setting.server-manager-action.delete') }}
      </button>
      <button class="action-btn" @click="move('up', index)">
        {{ $t('setting.server-manager-action.up') }}
      </button>
      <button class="action-btn" @click="move('down', index)">
        {{ $t('setting.server-manager-action.down') }}
      </button>
      <button class="action-btn" @click="setCurrentServerBackend(index)">
        {{ $t('setting.server-manager-action.set') }}
      </button>
    </div>

    <div select-none pointer-events-none mt-3 md:mt-0 flex="~ items-center">
      <div v-if="checking" flex="~ items-center gap-1">
        <NSpin :size="15" /> {{ $t('setting.checking-server') }}
      </div>
      <div v-else-if="currentServerBackend" flex="~ items-center gap-1">
        <div i-ph-check />
        {{ $t('setting.used-server') }}
      </div>
      <div v-else />
    </div>
  </div>
</template>

<style lang="less" scoped>
.action-btn {
  @apply hover:scale-105 active:scale-95 transition-all text-nowrap btn bg-red-5 color-white;
}
</style>
