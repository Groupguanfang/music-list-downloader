import { ISongService, SongDetailRequest, SongDetailResponse } from '#/song.protocol'
import { Value } from '@nailyjs/config'
import { Service } from '@nailyjs/ioc'
import Netease from 'NeteaseCloudMusicApi'

@Service()
export class SongService implements ISongService {
  constructor(
    @Value('naily.app.internalCookie')
    private readonly internalCookie: string,
  ) {}

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
}
