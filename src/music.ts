import { clear } from 'node:console'
import type { Readable } from 'node:stream'
import fs, { createWriteStream } from 'node:fs'
import path from 'node:path'
import Music from 'NeteaseCloudMusicApi'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import sanitize from 'sanitize-filename'
import { useLogger } from './logger'
import { useReadCookie } from './read-cookie'

export function useDownloadMusic(
  musicId: string | number,
  downloadDir: string = './config/music',
  level: string = 'silly',
) {
  if (!musicId)
    throw new Error('musicId is required')

  const { cookie, cookieDir } = useReadCookie()
  const { logger } = useLogger(level)

  return {
    async download() {
      clear()
      logger.info('下载任务即将开始')
      logger.info(`从 ${cookieDir} 加载cookie成功`)
      logger.info(`当前Cookie: ${cookie.length > 60 ? `${cookie.slice(0, 60)}...` : cookie}`)
      logger.info(`正在下载音乐 ${musicId}...`)

      const musicInfo = await Music.song_detail({ ids: musicId.toString(), cookie })
      const result = await Music.song_download_url({ id: musicId, cookie })
      const url = (result.body.data as any).url as string || ''
      const song_detail: any = (musicInfo.body.songs || [])[0] || {}
      const name = sanitize(`${song_detail.name} - ${((song_detail.ar || [])[0] || {}).name}`)

      const res: AxiosResponse<Readable> = await axios.get(url, { responseType: 'stream' })
      const downloadPath = path.join(downloadDir, `${name}.mp3`)
      if (!fs.existsSync(downloadPath))
        fs.mkdirSync(downloadDir, { recursive: true })
      res.data.pipe(createWriteStream(`${downloadDir}/${name}.mp3`))

      return new Promise<void>((resolve, reject) => {
        res.data.on('finish', (...args) => {
          logger.info(`音乐 ${musicId}: ${name} 下载成功`)
          resolve(...args)
        })
        res.data.on('error', (err) => {
          logger.error(`音乐 ${musicId}: ${name} 下载失败`)
          reject(err)
        })
      })
    },
  }
}
