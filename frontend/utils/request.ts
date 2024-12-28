import { createElectronClient } from '@nailyjs/electron/rpc'
import { AxiosRpcClientReturn, createAxiosClient } from '@nailyjs/rpc/axios'
import { isClient } from '@vueuse/core'
import { useSettingStore } from '~/stores/settings'

export function useRequest(): AxiosRpcClientReturn {
  const settingStore = useSettingStore()

  // 如果是electron环境，使用electron rpc
  if (isClient && globalThis.window.electron) {
    return createElectronClient(
      window.electron.request,
      '__naily:electron:rpc__',
    )
  }

  // 如果是浏览器环境，使用axios rpc
  return createAxiosClient({
    urlOrAxiosInstance: settingStore.currentServerBackendInfo?.url,
    ssr: !isClient,
  })
}
