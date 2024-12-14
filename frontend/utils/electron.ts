import type { InjectionToken } from '@nailyjs/ioc'
import type { RpcServerRequest } from '@nailyjs/rpc'

export interface ElectronRpcClientReturn {
  request<T extends Record<string, any>>(injectionToken: string | symbol): RpcServerRequest<T>
}

export type InvokeFn = (channel: string, ...args: any[]) => Promise<any>

export function createElectronClient(invokeFn: InvokeFn, handlerToken: string): ElectronRpcClientReturn {
  function request<T extends Record<string, any>>(injectionToken: InjectionToken): RpcServerRequest<T> {
    function createProxy(path: (string | symbol)[] = []): RpcServerRequest<T> {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      return new Proxy(async () => {}, {
        async apply(_target, thisArg, argArray) {
          let result = await invokeFn(handlerToken, {
            jsonrpc: '2.0',
            id: crypto.randomUUID(),
            method: `${injectionToken.toString()}.${path.join('.')}`,
            params: argArray,
          })

          result = JSON.parse(result)

          if (result.error)
            return result.error

          return result.result
        },

        get(_, prop) {
          return createProxy([...path, prop])
        },
      }) as RpcServerRequest<T>
    }

    return createProxy()
  }

  return {
    request,
  }
}
