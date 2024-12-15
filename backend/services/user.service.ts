import { CheckQrCodeResponse, CheckQrCodeResponseType, CreateQrCodeResponse, CurrentAccountResponse, IUserService } from '#/music.protocol'
import { RequestBase } from '#/types'
import { Service } from '@nailyjs/ioc'
import Netease from 'NeteaseCloudMusicApi'
import { match } from 'ts-pattern'

@Service()
export class UserService implements IUserService {
  async createQrCode(): Promise<CreateQrCodeResponse> {
    const qrCodeKey = await Netease.login_qr_key({})
    const qrCodeKeyData = qrCodeKey.body.data as any

    const qrCode = await Netease.login_qr_create({
      key: qrCodeKeyData.unikey as string | number,
      qrimg: true,
    })
    const qrCodeData = qrCode.body.data as any

    return {
      base64: qrCodeData.qrimg as string,
      key: qrCodeKeyData.unikey as string | number,
    }
  }

  async checkQrCode(key: string): Promise<CheckQrCodeResponse> {
    const checkQrCode = await Netease.login_qr_check({
      key,
    })

    return {
      type: match(checkQrCode.body.code)
        .with(800, () => CheckQrCodeResponseType.Expired)
        .with(801, () => CheckQrCodeResponseType.Wait)
        .with(802, () => CheckQrCodeResponseType.Confirm)
        .with(803, () => CheckQrCodeResponseType.Success)
        .run(),
      cookie: checkQrCode.body.cookie as string,
    }
  }

  async getCurrentAccount(request?: RequestBase): Promise<CurrentAccountResponse> {
    const result = await Netease.user_account({
      cookie: request?.cookie,
    })

    const profile: any = result.body.profile

    return {
      name: profile.nickname,
      avatar: profile.avatarUrl,
      id: profile.userId,
      signature: profile.signature,
    }
  }
}