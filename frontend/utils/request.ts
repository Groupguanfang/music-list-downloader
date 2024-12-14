import { AxiosRpcClientReturn, createAxiosClient } from '@nailyjs/rpc/axios'
import { isClient } from '@vueuse/core'
import { useSettingStore } from '~/stores/settings'
import { createElectronClient } from './electron'

export function useRequest(): AxiosRpcClientReturn {
  const settingStore = useSettingStore()

  if (isClient && window.electron)
    return createElectronClient(window.electron.request, '__naily:electron:rpc__')

  return createAxiosClient({
    urlOrAxiosInstance: settingStore.currentServerBackendInfo?.url,
    ssr: !isClient,
  })
}
