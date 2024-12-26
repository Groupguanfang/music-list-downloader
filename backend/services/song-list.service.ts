import { ISongListService, PersonalizedSongListRequest, PersonalizedSongListResponse, SongListDetailRequest, SongListDetailResponse, UserSongListsRequest, UserSongListsResponse } from '#/song-list.protocol'
import { Service } from '@nailyjs/ioc'
import Netease from 'NeteaseCloudMusicApi'

@Service()
export class SongListService implements ISongListService {
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
}
