import { Aliasable, Idable, Nameable, Paginationable, RequestBase } from './types'

export interface Artist extends Idable, Nameable {}

export interface ArtistDetailRequest extends RequestBase, Idable {}
export interface ArtistDetailResponse extends Artist, Aliasable {
  avatar: string
  description: string
  albumCount: number
  singleSongCount: number
}

export interface PersonalizedArtistsRequest extends RequestBase, Paginationable {}
export interface PersonalizedArtistsResponseResult extends Artist {
  avatar: string
}
export interface PersonalizedArtistsResponse {
  result: PersonalizedArtistsResponseResult[]
}

export interface IArtistService {
  getArtistDetail(request: ArtistDetailRequest): Promise<ArtistDetailResponse>
  getPersonalizedArtists(request?: PersonalizedArtistsRequest): Promise<PersonalizedArtistsResponse>
}
