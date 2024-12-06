import { MusicController } from '#/music.protocol'
import { useRequest } from '~/utils/request'

export function useMusicController() {
  const request = useRequest()

  return request.request<MusicController>(MusicController)
}
