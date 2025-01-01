import { defineStore } from 'pinia'
import { DownloadStore } from '~/classes/download-store'
import { DownloadZip } from '~/classes/download-zip'

export const useDownloadStore = defineStore('__naily:music-downloader-download-store__', () => {
  const zip = ref<Record<string, DownloadZip>>({})
  const operator = new DownloadStore(zip)

  return {
    operator,
    zip,
  }
}, {
  persist: true,
})
