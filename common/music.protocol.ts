import { IArtistService } from './artist.protocol'
import { ISongListService } from './song-list.protocol'
import { ISongService } from './song.protocol'
import { IUserService } from './user.protocol'

export const MusicController = 'MusicController'
export interface VersionResponse {
  version: string
}
export interface MusicController {
  readonly user: IUserService
  readonly songList: ISongListService
  readonly artist: IArtistService
  readonly song: ISongService
  getVersion(): Promise<VersionResponse>
}
