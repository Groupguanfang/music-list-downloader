import { createAxiosClient } from '@nailyjs/rpc/axios'
import { isClient } from '@vueuse/core'

export function useRequest() {
  return createAxiosClient({
    urlOrAxiosInstance: '/rpc',
    ssr: !isClient,
  })
}
