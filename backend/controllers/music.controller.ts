import { ArtistDetailRequest, ArtistDetailResponse, MusicController, PersonalizedArtistsRequest, PersonalizedArtistsResponse, PersonalizedSongListRequest, PersonalizedSongListResponse, SongDetailRequest, SongDetailResponse, SongListDetailRequest, SongListDetailResponse, UserSongListsRequest, UserSongListsResponse, VersionResponse } from '#/music.protocol'
import { version } from '#/package.json'
import { UserService } from '@/services/user.service'
import { Value } from '@nailyjs/config'
import { RpcController } from '@nailyjs/rpc'
import Netease from 'NeteaseCloudMusicApi'
import { computed } from 'vue'

@RpcController(MusicController)
export class MusicControllerImpl implements MusicController {
  constructor(
    public readonly user: UserService,
    @Value('naily.app.internalCookie')
    private readonly internalCookie: string,
  ) {}

  async getPersonalizedSongLists(request?: PersonalizedSongListRequest): Promise<PersonalizedSongListResponse> {
    const response = await Netease.personalized({
      limit: request?.limit,
      cookie: request?.cookie,
    })

    const result: any[] = (response.body.result || []) as any[]

    return {
      result: result.map(item => ({
        id: item.id,
        name: item.name,
        cover: item.picUrl,
      })),
    }
  }

  async getPersonalizedArtists(request?: PersonalizedArtistsRequest): Promise<PersonalizedArtistsResponse> {
    const response = await Netease.top_artists({
      cookie: (request || {})?.cookie,
      limit: (request || {}).limit,
      offset: (request || {}).offset,
    })

    const result: any[] = (response.body.artists || []) as any[]

    return {
      result: result.map(item => ({
        id: item.id,
        name: item.name,
        avatar: item.picUrl,
      })),
    }
  }

  async getSongListDetail(request?: SongListDetailRequest): Promise<SongListDetailResponse> {
    if (!request?.id)
      throw new Error('id is required')
    const [detailResponse, songsResponse] = await Promise.all([
      Netease.playlist_detail({ id: request.id }),
      Netease.playlist_track_all({ id: request.id, cookie: request.cookie }),
    ])

    const detailData = detailResponse.body.playlist as any
    const songsData = songsResponse.body.songs as any[]

    return {
      id: detailData.id,
      name: detailData.name,
      cover: detailData.coverImgUrl,
      description: detailData.description,
      songs: songsData.map(item => ({
        id: item.id,
        name: item.name,
        cover: item.al.picUrl,
        subTitle: (item.alia || [])[0] || null,
        alias: item.alia || [],
        artists: (item.ar || []).map((artist: any) => ({
          id: artist.id,
          name: artist.name,
        })),
      })),
    }
  }

  async getUserSongLists(request?: UserSongListsRequest): Promise<UserSongListsResponse> {
    if (!request?.id)
      throw new Error('id is required')
    const response = await Netease.user_playlist({
      cookie: request?.cookie,
      uid: request!.id,
    })

    const songLists = response.body.playlist as any[]

    return {
      songLists: songLists.map(item => ({
        id: item.id,
        name: item.name,
        cover: item.coverImgUrl,
      })),
    }
  }

  async getSongDetail(request: SongDetailRequest): Promise<SongDetailResponse> {
    const cookie = computed(() => this.internalCookie || request.cookie)

    const [detailResponse, urlResponse] = await Promise.all([
      Netease.song_detail({
        ids: request.id as string,
        cookie: request.useInternalCookieIfExist === true ? cookie.value : request.cookie,
      }),
      Netease.song_url({
        id: request.id,
        cookie: request.useInternalCookieIfExist === true ? cookie.value : request.cookie,
      }),
    ])

    const detailData = detailResponse.body.songs[0] as any
    const urlData = (urlResponse.body.data as any)[0] as any

    return {
      id: detailData.id,
      name: detailData.name,
      cover: detailData.al.picUrl,
      url: urlData.url,
      subTitle: (detailData.alia || [])[0] || null,
      alias: detailData.alia || [],
      artists: (detailData.ar || []).map((artist: any) => ({
        id: artist.id,
        name: artist.name,
      })),
    }
  }

  async getArtistDetail(request: ArtistDetailRequest): Promise<ArtistDetailResponse> {
    const response = await Netease.artist_detail({
      id: (request || {}).id,
    })

    const result = response.body.data as any || {}
    const artistData = result.artist || {}

    return {
      id: artistData.id,
      name: artistData.name,
      avatar: artistData.avatar,
      description: artistData.briefDesc,
      albumCount: artistData.albumSize,
      singleSongCount: artistData.musicSize,
      alias: [
        ...(artistData.transNames || []),
        ...(artistData.alias || []),
      ],
    }
  }

  async getVersion(): Promise<VersionResponse> {
    return {
      version,
    }
  }
}
