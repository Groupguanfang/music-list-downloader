import { defineStore } from 'pinia'
import { randomId } from '~/utils/random'

export interface ServerBackend {
  name: string
  url: string
  readonly?: boolean
  id: string
}

export const useSettingStore = defineStore('__naily:music-downloader-setting-store__', () => {
  const useInternalDownloadCookie = ref(false)
  const serverBackends = ref<ServerBackend[]>([
    {
      name: '当前服务器',
      url: '/rpc',
      readonly: true,
      id: randomId(),
    },
  ])
  const currentServerBackend = ref<string>(serverBackends.value[0].id)

  return {
    useInternalDownloadCookie,
    serverBackends,
    currentServerBackend,
  }
}, {
  persist: true,
})
