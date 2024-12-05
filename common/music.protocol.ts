import type { Coverable, Describeable, Idable, Limitable, Nameable, RequestBase } from './types'

export const MusicController = 'MusicController'

export interface PersonalizedSongListRequest extends RequestBase, Limitable {}
export interface PersonalizedSongListResponseResult extends Idable, Nameable, Coverable {}
export interface PersonalizedSongListResponse {
  result: PersonalizedSongListResponseResult[]
}
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
export interface Artist extends Idable, Nameable {}
export interface Song extends Idable, Nameable, Coverable {
  subTitle: string | null
  alias: string[]
  artists: Artist[]
}
export interface SongListDetailRequest extends RequestBase, Idable {}
export interface SongListDetailResponse extends Coverable, Idable, Nameable, Describeable {
  songs: Song[]
}
export interface CurrentAccountResponse extends Idable, Nameable {
  avatar: string
  signature: string
  [key: string]: any
}
export interface SongList extends Idable, Nameable, Coverable {}
export interface UserSongListsResponse {
  songLists: SongList[]
}
export interface UserSongListsRequest extends RequestBase, Idable {}
export interface MusicController {
  readonly user: IUserService

  getPersonalizedSongLists(request?: PersonalizedSongListRequest): Promise<PersonalizedSongListResponse>
  getSongListDetail(request?: SongListDetailRequest): Promise<SongListDetailResponse>
  getUserSongLists(request: UserSongListsRequest): Promise<UserSongListsResponse>
}
export interface IUserService {
  createQrCode(): Promise<CreateQrCodeResponse>
  checkQrCode(key: string | number): Promise<CheckQrCodeResponse>
  getCurrentAccount(request?: RequestBase): Promise<CurrentAccountResponse>
}
