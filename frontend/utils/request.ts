import { createAxiosClient } from '@nailyjs/rpc/axios'
import { isClient } from '@vueuse/core'

export function useRequest() {
  const settingStore = useSettingStore()

  return createAxiosClient({
    urlOrAxiosInstance: settingStore.currentServerBackendInfo?.url,
    ssr: !isClient,
  })
}
