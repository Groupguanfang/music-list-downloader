import { ArtistDetailRequest, ArtistDetailResponse, IArtistService, PersonalizedArtistsRequest, PersonalizedArtistsResponse } from '#/artist.protocol'
import { Service } from '@nailyjs/ioc'
import Netease from 'NeteaseCloudMusicApi'

@Service()
export class ArtistService implements IArtistService {
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
}
