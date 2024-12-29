import { Idable, Nameable, RequestBase } from './types'

export interface CreateQrCodeResponse {
  base64: string
  key: string | number
  name: Record<string, string>
  [index: string]: any
}

export enum CheckQrCodeResponseType {
  Wait = 801,
  Confirm = 802,
  Success = 803,
  Expired = 800,
}
export interface CheckQrCodeResponse {
  type: CheckQrCodeResponseType
  cookie: string
}

export interface CurrentAccountResponse extends Idable, Nameable {
  avatar: string
  signature: string
  [key: string]: any
}

export interface IUserService {
  /**
   * 创建二维码
   *
   * @return {Promise<CreateQrCodeResponse>} 二维码信息
   */
  createQrCode(): Promise<CreateQrCodeResponse>
  /**
   * 检查二维码是否已确认，如果确定返回cookie
   *
   * @param {string | number} key 二维码 key
   * @return {Promise<CheckQrCodeResponse>} 二维码状态
   */
  checkQrCode(key: string | number): Promise<CheckQrCodeResponse>
  /**
   * 获取当前已登录账号信息
   *
   * @param {RequestBase} request 请求参数
   * @return {Promise<CurrentAccountResponse>} 当前登录账号
   */
  getCurrentAccount(request?: RequestBase): Promise<CurrentAccountResponse>
}
