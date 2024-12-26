import { Artist } from './artist.protocol'
import { Aliasable, Coverable, Idable, Nameable, RequestBase } from './types'

export interface Song extends Idable, Nameable, Coverable, Aliasable {
  subTitle: string | null
  artists: Artist[]
}

export interface SongDetailRequest extends RequestBase, Idable {
  useInternalCookieIfExist?: boolean
}
export interface SongDetailResponse extends Song {
  url: string
}
export interface ISongService {
  getSongDetail(request: SongDetailRequest): Promise<SongDetailResponse>
}
