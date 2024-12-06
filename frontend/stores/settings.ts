import { defineStore } from 'pinia'

export const useSettingStore = defineStore('__naily:music-downloader-setting-store__', () => {
  const useInternalDownloadCookie = ref(false)
  const serverBackends = ref<string[]>([])

  return {
    useInternalDownloadCookie,
    serverBackends,
  }
}, {
  persist: true,
})
