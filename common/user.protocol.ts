import { Idable, Nameable, RequestBase } from './types'

export interface CreateQrCodeResponse {
  base64: string
  key: string | number
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
  createQrCode(): Promise<CreateQrCodeResponse>
  checkQrCode(key: string | number): Promise<CheckQrCodeResponse>
  getCurrentAccount(request?: RequestBase): Promise<CurrentAccountResponse>
}
