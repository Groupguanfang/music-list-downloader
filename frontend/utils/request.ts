import { CommunicationChannel } from '$/channel'
import { createElectronClient } from '@nailyjs/electron/rpc'
import { AxiosRpcClientReturn, createAxiosClient } from '@nailyjs/rpc/axios'
import { isClient } from '@vueuse/core'
import { load } from 'js-yaml'
import { get } from 'lodash-es'
import { useSettingStore } from '~/stores/settings'
import config from '../../config.yml?raw'

export function useRequest(): AxiosRpcClientReturn {
  const settingStore = useSettingStore()

  // 如果是electron环境而且当前服务器为默认服务器，使用electron rpc与主进程上的后端通信
  if (isClient && globalThis.window.electron && settingStore.currentServerBackendInfo?.readonly) {
    return createElectronClient(
      window.electron.request,
      get(load(config), 'handlerToken', CommunicationChannel.RPC),
    )
  }

  // 如果是浏览器环境，使用axios rpc
  return createAxiosClient({
    urlOrAxiosInstance: settingStore.currentServerBackendInfo?.url,
    ssr: !isClient,
  })
}
