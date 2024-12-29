import { IArtistService } from './artist.protocol'
import { ISongListService } from './song-list.protocol'
import { ISongService } from './song.protocol'
import { IUserService } from './user.protocol'

export const MusicController = 'MusicController'
export interface VersionResponse {
  version: string
  type: string
}
export interface MusicController {
  readonly user: IUserService
  readonly songList: ISongListService
  readonly artist: IArtistService
  readonly song: ISongService
  /**
   * 获取后端版本等相关信息
   *
   * @return {Promise<VersionResponse>} 信息
   */
  getVersion(): Promise<VersionResponse>
  /**
   * 代理请求，只允许在网页中调用；electron环境中不需要也不允许调用此接口
   *
   * @param {string} url 请求地址
   * @return {Promise<Response>} 响应
   */
  proxyRequest(url: string): Promise<Response>
}
