import { ipcMain } from 'electron'
import { CommunicationChannel } from './channel'

export interface ImplementedOnChannel {
  type: 'on'
  handler: Parameters<typeof import('electron').ipcMain['on']>[1]
}

export interface ImplementedInvokeChannel {
  type: 'invoke'
  handler: Parameters<typeof import('electron').ipcMain['handle']>[1]
}

export type ImplementedChannel = ImplementedOnChannel | ImplementedInvokeChannel
export type ShouldImplementChannel = Exclude<CommunicationChannel, CommunicationChannel.RPC>

/**
 * 定义通道。必须实现所有通道（与{@linkcode CommunicationChannel}中的通道一一对应），否则会报类型错误。
 *
 * @note 如果某个通道不需要实现，或者有另外的实现方法，
 * 可以修改{@linkcode ShouldImplementChannel}类型，排除掉某个通道。
 *
 * @example
 * ```ts
 * defineChannel({
 *   [CommunicationChannel.CloseWindow]: {
 *     type: 'on',
 *     handler: () => win.close(),
 *   },
 * })
 * ```
 */
export function defineChannel(channel: Record<ShouldImplementChannel, ImplementedChannel>) {
  for (const [key, value] of Object.entries(channel)) {
    if (value.type === 'on')
      ipcMain.on(key, value.handler as any)
    else
      ipcMain.handle(key, value.handler as any)
  }
  return channel
}
