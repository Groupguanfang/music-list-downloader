import { VersionResponse } from '#/music.protocol'
import { CommunicationChannel } from '$/channel'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { load } from 'js-yaml'
import { get } from 'lodash-es'
import { match } from 'ts-pattern'
import { typeAssert } from '~/types'
import { randomId } from '~/utils/random'
import config from '../../config.yml?raw'

export interface JsonRpcSuccessResponse<T> {
  jsonrpc: '2.0'
  id: string
  result: T
}

export function useApiTestUtils(interval: number = 1000) {
  /**
   * 使用axios检测服务器是否可用
   *
   *
   * @param url 服务器地址
   * @returns - {@linkcode VersionResponse} 服务器可用
   * @returns - `false` 服务器不可用
   * @returns - {@linkcode AxiosError} 服务器请求失败
   */
  async function checkAxiosAvailable(url: string): Promise<VersionResponse | false | AxiosError> {
    return await Promise.allSettled([
      axios.post(url, {
        jsonrpc: '2.0',
        id: randomId(),
        method: 'MusicController.getVersion',
      }),
      new Promise(resolve => setTimeout(resolve, interval)),
    ])
      // 将结果转换为匹配器
      .then(([res]) => [match(res.status), res] as const)
      // 匹配结果
      .then(([match, res]) => match
        // 请求成功
        .with('fulfilled', (): VersionResponse | false => {
          typeAssert<PromiseFulfilledResult<AxiosResponse<JsonRpcSuccessResponse<VersionResponse>>>>(res)
          // 返回数据结构正确
          if (typeof res?.value.data?.result?.version === 'string')
            return res.value.data.result
          // 请求成功但返回数据结构不正确
          else
            return false
        })
        // 请求失败
        .with('rejected', (): AxiosError => {
          typeAssert<PromiseRejectedResult>(res)
          return res?.reason
        }))
      // 运行匹配器
      .then(match => match.run())
  }

  /**
   * 使用electron内部通信通道检测服务器是否可用
   *
   * @returns - {@linkcode VersionResponse} 服务器可用
   * @returns - `false` 服务器不可用
   */
  async function checkElectronAvailable(): Promise<VersionResponse | false> {
    if (!globalThis.window.electron || typeof globalThis.window.electron.request !== 'function')
      return false

    const versionResponse: JsonRpcSuccessResponse<VersionResponse> = await globalThis.window.electron.request(
      get(load(config), 'handlerToken', CommunicationChannel.RPC),
      {
        jsonrpc: '2.0',
        id: randomId(),
        method: 'MusicController.getVersion',
      },
    )

    if (typeof versionResponse?.result?.version === 'string')
      return versionResponse?.result
    else
      return false
  }

  return {
    checkAxiosAvailable,
    checkElectronAvailable,
  }
}
