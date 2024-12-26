import { MusicController, VersionResponse } from '#/music.protocol'
import { version } from '#/package.json'
import { ArtistService } from '@/services/artist.service'
import { SongListService } from '@/services/song-list.service'
import { SongService } from '@/services/song.service'
import { UserService } from '@/services/user.service'
import { RpcController } from '@nailyjs/rpc'

@RpcController(MusicController)
export class MusicControllerImpl implements MusicController {
  constructor(
    public readonly user: UserService,
    public readonly songList: SongListService,
    public readonly artist: ArtistService,
    public readonly song: SongService,
  ) {}

  async getVersion(): Promise<VersionResponse> {
    return {
      version,
    }
  }
}
