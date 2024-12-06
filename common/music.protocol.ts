import type { Aliasable, Coverable, Describeable, Idable, Limitable, Nameable, Paginationable, RequestBase } from './types'

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
export interface Song extends Idable, Nameable, Coverable, Aliasable {
  subTitle: string | null
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
export interface SongDetailRequest extends RequestBase, Idable {
  useInternalCookieIfExist?: boolean
}
export interface SongDetailResponse extends Song {
  url: string
}
export interface ArtistDetailRequest extends RequestBase, Idable {}
export interface ArtistDetailResponse extends Artist, Aliasable {
  avatar: string
  description: string
  albumCount: number
  singleSongCount: number
}
export interface VersionResponse {
  version: string
}
export interface PersonalizedArtistsRequest extends RequestBase, Paginationable {}
export interface PersonalizedArtistsResponseResult extends Artist {
  avatar: string
}
export interface PersonalizedArtistsResponse {
  result: PersonalizedArtistsResponseResult[]
}
export interface MusicController {
  readonly user: IUserService

  getPersonalizedSongLists(request?: PersonalizedSongListRequest): Promise<PersonalizedSongListResponse>
  getPersonalizedArtists(request?: PersonalizedArtistsRequest): Promise<PersonalizedArtistsResponse>
  getSongListDetail(request?: SongListDetailRequest): Promise<SongListDetailResponse>
  getUserSongLists(request: UserSongListsRequest): Promise<UserSongListsResponse>
  getSongDetail(request: SongDetailRequest): Promise<SongDetailResponse>
  getArtistDetail(request: ArtistDetailRequest): Promise<ArtistDetailResponse>
  getVersion(): Promise<VersionResponse>
}
export interface IUserService {
  createQrCode(): Promise<CreateQrCodeResponse>
  checkQrCode(key: string | number): Promise<CheckQrCodeResponse>
  getCurrentAccount(request?: RequestBase): Promise<CurrentAccountResponse>
}
