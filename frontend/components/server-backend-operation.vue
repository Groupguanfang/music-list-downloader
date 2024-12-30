<script setup lang="tsx">
import { VersionResponse } from '#/music.protocol'
import { AxiosError } from 'axios'
import { useMessage } from 'naive-ui'
import { typeAssert } from '~/types'

const props = defineProps<{
  index: number
  create: (index: number) => void
  remove: (index: number) => void
  move: (direction: 'up' | 'down', index: number) => void
}>()

const { t } = useI18n()
const message = useMessage()
const settingStore = useSettingStore()
const apiTestUtils = useApiTestUtils()
const { isElectron } = useEnvironment()

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
  if (serverBackend.readonly && isElectron.value) {
    const checkResult = await apiTestUtils.checkElectronAvailable()
    if (!checkResult) {
      message.error(t('setting.server-manager-message.connect-failed'))
    }
    else {
      message.success(t('setting.server-manager-message.electron-connected', { version: checkResult.version }))
    }
    checking.value = false
    return
  }

  const checkResult = await apiTestUtils.checkAxiosAvailable(serverBackend.url)
  switch (checkResult) {
    case false:
      message.error(t('setting.server-manager-message.no-valid-api-server'))
      break
    case checkResult instanceof AxiosError:
      message.error(t('setting.server-manager-message.connect-failed'))
      break
    default:
      typeAssert<VersionResponse>(checkResult)
      message.success(t('setting.server-manager-message.connected', { version: checkResult.version }))
      settingStore.currentServerBackend = serverBackend.id
      break
  }
  checking.value = false
}

function removeServerBackend(index: number) {
  const serverBackend = settingStore.serverBackends[index] || {}
  if (serverBackend.readonly === true)
    return message.error(t('setting.server-manager-message.cannot-delete-default-server'))
  if (serverBackend.id === settingStore.currentServerBackend)
    return message.error(t('setting.server-manager-message.cannot-delete-current-server'))

  props.remove(index)
}
</script>

<template>
  <div flex="~ col md:row justify-between md:items-center" my-3>
    <div flex="~ wrap gap-2 md:gap-3">
      <button class="action-btn" @click="create(index)">
        <div i-ph-plus />
        <div hidden md:block>
          {{ $t('setting.server-manager-action.add') }}
        </div>
      </button>
      <button class="action-btn" @click="removeServerBackend(index)">
        <div i-ph-trash-duotone />
        <div hidden md:block>
          {{ $t('setting.server-manager-action.delete') }}
        </div>
      </button>
      <button class="action-btn" :disabled="index === 0" @click="move('up', index)">
        <div i-ph-arrow-up-duotone />
        <div hidden md:block>
          {{ $t('setting.server-manager-action.up') }}
        </div>
      </button>
      <button class="action-btn" :disabled="index === settingStore.serverBackends.length - 1" @click="move('down', index)">
        <div i-ph-arrow-down-duotone />
        <div hidden md:block>
          {{ $t('setting.server-manager-action.down') }}
        </div>
      </button>
      <button class="action-btn" @click="setCurrentServerBackend(index)">
        <div i-ph-check-duotone />
        <div hidden md:block>
          {{ $t('setting.server-manager-action.set') }}
        </div>
      </button>
    </div>

    <div select-none pointer-events-none mt-3 md:mt-0 flex="~ items-center" text-nowrap>
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
