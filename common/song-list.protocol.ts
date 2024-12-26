import { Song } from './song.protocol'
import { Coverable, Describeable, Idable, Limitable, Nameable, RequestBase } from './types'

export interface SongList extends Idable, Nameable, Coverable {}
export interface SongListDetailRequest extends RequestBase, Idable {}
export interface SongListDetailResponse extends Coverable, Idable, Nameable, Describeable {
  songs: Song[]
}
export interface UserSongListsRequest extends RequestBase, Idable {}
export interface UserSongListsResponse {
  songLists: SongList[]
}
export interface PersonalizedSongListRequest extends RequestBase, Limitable {}
export interface PersonalizedSongListResponseResult extends Idable, Nameable, Coverable {}
export interface PersonalizedSongListResponse {
  result: PersonalizedSongListResponseResult[]
}
export interface ISongListService {
  getSongListDetail(request: SongListDetailRequest): Promise<SongListDetailResponse>
  getUserSongLists(request: UserSongListsRequest): Promise<UserSongListsResponse>
  getPersonalizedSongLists(request?: PersonalizedSongListRequest): Promise<PersonalizedSongListResponse>
}
