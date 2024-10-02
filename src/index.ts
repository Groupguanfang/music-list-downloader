import { clear } from 'node:console'
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import Music from 'NeteaseCloudMusicApi'
import axios from 'axios'
import { useLogger } from './logger'
import { useReadCookie } from './read-cookie'

interface ParseList {
  id: string | number
  name: string
}

export function useDownloadList(listId: string | number, downloadDir: string = './config/music') {
  if (!listId)
    throw new Error('listId is required')
  if (typeof listId !== 'string' && typeof listId !== 'number')
    throw new Error('listId must be a string or number')

  const { cookie, cookieDir } = useReadCookie()
  const { logger } = useLogger()

  return {
    async download() {
      clear()
      logger.info('下载任务即将开始')
      logger.info(`从 ${cookieDir} 加载cookie成功`)
      logger.info(`当前Cookie: ${cookie.length > 60 ? `${cookie.slice(0, 60)}...` : cookie}`)
      logger.info(`正在获取歌单 ${listId} 的所有音乐信息...`)
      const ids = await Music.playlist_track_all({ id: listId, cookie })
        .then(res => (res.body.songs || []) as Record<string, any>[])
        .then<ParseList[]>((songs) => {
          return songs.map(({ name, ar, id }) => ({
            id,
            name: `${name} - ${(ar[0] || {}).name}`,
          }))
        })
      logger.info(`歌单 ${listId} 共有 ${ids.length} 首音乐, 正在下载...`)

      // 下载音乐，每次下载10首，避免一次性下载过多音乐导致下载失败
      for (let i = 0; i < ids.length; i += 10) {
        const downloadIds = ids.slice(i, i + 10)
        await Promise.all(downloadIds.map(({ id, name }, index) => {
          if (existsSync(path.join(downloadDir, `${name}.mp3`))) {
            logger.info(`index: ${i + index} 音乐 ${name} 已存在, 跳过下载`)
            return Promise.resolve()
          }
          return Music.song_download_url({ id, cookie })
            .then(res => (res.body.data as any).url as string)
            .then(url => axios.get(url, { responseType: 'stream' }))
            .then((res) => {
              if (!existsSync(downloadDir))
                mkdirSync(downloadDir, { recursive: true })
              const writer = res.data.pipe(createWriteStream(path.join(downloadDir, `${name}.mp3`)))
              return new Promise<void>((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
              })
            })
            .then(() => logger.info(`index: ${i + index} 音乐 ${name} 下载成功`))
            .catch(err => logger.error(`index: ${i + index} 音乐 ${name} 下载失败: ${err.message}`))
        }))
      }
    },
  }
}
