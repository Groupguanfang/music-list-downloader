/**
 * 统一管理electron与渲染进程之间的通信通道
 */
export enum CommunicationChannel {
  /**
   * 主进程与渲染进程之间的主通信通道，默认使用`mld:rpc`
   * 同时在编译时也可在`config.yml`中设置`handlerToken`进行配置
   */
  RPC = 'mld:rpc',
  /**
   * 关闭窗口
   */
  CloseWindow = 'mld:close-window',
  /**
   * 最小化窗口
   */
  MinimizeWindow = 'mld:minimize-window',
  /**
   * 最大化窗口
   */
  MaximizeWindow = 'mld:maximize-window',
  /**
   * 获取平台
   */
  GetPlatform = 'mld:get-platform',
}
