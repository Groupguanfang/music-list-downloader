import { load } from 'js-yaml'
import { get } from 'lodash-es'
import { defineStore } from 'pinia'
import { randomId } from '~/utils/random'
import config from '../../config.yml?raw'

export interface ServerBackend {
  name: string
  url: string
  readonly?: boolean
  id: string
}

export const useSettingStore = defineStore('__naily:music-downloader-setting-store__', () => {
  const useInternalDownloadCookie = ref(false)
  const result: any = load(config || '')
  const defaultServerBackends = get(result, 'internalServer.baseURL', '/_api')

  const serverBackends = ref<ServerBackend[]>([
    {
      name: '内置服务器',
      url: defaultServerBackends,
      readonly: true,
      id: randomId(),
    },
  ])
  const currentServerBackend = ref<string>(serverBackends.value[0].id)
  const currentServerBackendInfo = computed(() => serverBackends.value.find(backend => backend.id === currentServerBackend.value))

  /**
   * 同步配置文件中的内置服务器地址
   */
  function syncDefaultServerBackendsInConfig() {
    const currentDefaultServerBackends = computed(() => serverBackends.value.find(backend => backend.readonly === true))
    const currentDefaultServerBackendsIndex = serverBackends.value.findIndex(backend => backend.readonly === true)
    if (!currentDefaultServerBackends.value)
      return
    if (currentDefaultServerBackends.value.url !== defaultServerBackends)
      serverBackends.value[currentDefaultServerBackendsIndex].url = defaultServerBackends
  }
  onMounted(syncDefaultServerBackendsInConfig)

  return {
    useInternalDownloadCookie,
    serverBackends,
    currentServerBackend,
    currentServerBackendInfo,
  }
}, {
  persist: true,
})
