import axios, { AxiosError } from 'axios'
import JSZip from 'jszip'
import { defineStore } from 'pinia'
import { useMusicController } from '~/apis/music'
import { typeAssert } from '~/types'
import { randomId } from '~/utils/random'
import { ServerBackend } from './settings'

export interface DownloadListItem {
  name?: string
  id: string | number
  percentage: number
  status: 'pending' | 'downloading' | 'finished' | 'failed' | 'compressing' | 'pre-compressing' | 'pre-downloading'
  url?: string
  server: ServerBackend
  blob?: Blob
  belongTo: string
}

export const useDownloadStore = defineStore('__naily:music-downloader-download-store__', () => {
  const downloadList = ref<DownloadListItem[]>([])
  const settingStore = useSettingStore()
  const { isElectron } = useEnvironment()
  const musicController = useMusicController()

  const belongs = computed(() => {
    const belongs: string[] = []
    for (const task of downloadList.value) {
      if (!belongs.includes(task.belongTo))
        belongs.push(task.belongTo)
    }
    return belongs
  })

  function getBelongTasks(belong: string) {
    return downloadList.value.filter(task => task.belongTo === belong)
  }

  async function addDownloadTask(
    task: { id: string | number, belongTo: string } & Omit<Partial<DownloadListItem>, 'percentage' | 'status' | 'server'>,
  ): Promise<void | 'NO_SERVER'> {
    if (!settingStore.currentServerBackendInfo)
      return 'NO_SERVER'
    downloadList.value.push({
      id: task.id,
      belongTo: task.belongTo,
      name: task.name,
      percentage: 0,
      server: settingStore.currentServerBackendInfo!,
      status: 'pending',
    })
    const detail = await musicController.song.getSongDetail({
      id: task.id,
    })
    if (!detail?.url)
      return
    const taskIndex = downloadList.value.findIndex(item => item.id === task.id)
    if (taskIndex === -1)
      return
    downloadList.value[taskIndex] = {
      ...downloadList.value[taskIndex],
      url: detail.url,
      status: 'pre-downloading',
      percentage: 33,
    }
  }

  function removeDownloadTask(id: string) {
    downloadList.value = downloadList.value.filter(item => item.id !== id)
  }

  async function download(task: DownloadListItem): Promise<DownloadListItem | void> {
    if (task.server.readonly && isElectron.value) {
      // TODO: 使用electron内置的下载
      return
    }

    return await axios.post(task.server.url, {
      jsonrpc: '2.0',
      id: randomId(),
      method: 'MusicController.proxyRequest',
      params: [task.url],
    }, {
      responseType: 'blob',
      onDownloadProgress: progressEvent => task.percentage = ((progressEvent.progress || 0) / 2) * 100,
    })
      .then(res => res.data as Blob)
      .then(blob => task.blob = blob)
      .then(() => task.status = 'pre-compressing')
      .then(() => task)
      .catch(async (err) => {
        console.error(err)
        typeAssert<AxiosError<Blob>>(err)
        await err.response?.data.text()
        // TODO: 下载失败
        task.status = 'failed'
      })
  }

  async function startAndCompressAll(): Promise<void> {
    const zip = new JSZip()

    const downloadedTasks = await Promise.all(
      downloadList.value.filter(task => task.status === 'pre-downloading')
        .map(async task => await download(task)),
    )

    for (const task of downloadedTasks) {
      if (!task)
        continue
      zip.file(`${task.name}.mp3`, task.blob!)
    }
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/zip',
    })
    removeAll()

    const a = document.createElement('a')
    a.href = URL.createObjectURL(zipBlob)
    a.download = 'download.zip'
    a.click()
    downloadList.value.map(task => task.status = 'finished')
  }

  function removeAll() {
    downloadList.value = []
  }

  return {
    downloadList,
    addDownloadTask,
    removeDownloadTask,
    startAndCompressAll,
    belongs,
    getBelongTasks,
  }
})
