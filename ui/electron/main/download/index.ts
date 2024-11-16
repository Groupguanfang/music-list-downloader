import { clear, log } from 'node:console'
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import type { Readable } from 'node:stream'
import Music from 'NeteaseCloudMusicApi'
import axios from 'axios'
import sanitize from 'sanitize-filename'
import { useLogger } from './logger'

export interface LoggerService {
  info(message: string): void
  error(message: string): void
  silly(message: string): void
  log(message?: string): void
}

export function useDownloadList(
  listId: string | number,
  cookie: string,
  downloadDir: string = './config/music',
  level: string = 'silly',
) {
  if (!listId)
    throw new Error('歌单id不能为空')
  if (typeof listId !== 'string' && typeof listId !== 'number')
    throw new Error('歌单id必须为字符串或数字')

  const winston = useLogger(level)

  interface ParseList {
    id: string | number
    name: string
  }

  return {
    async download(logger: LoggerService = {
      ...winston.logger,
      log: (message: string) => log(message),
    }) {
      clear()
      logger.info('下载任务即将开始')
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
      const successList: ParseList[] = []
      const failList: ParseList[] = []
      const skipList: ParseList[] = []

      // 下载音乐，每次下载10首，避免一次性下载过多音乐导致下载失败
      for (let i = 0; i < ids.length; i += 10) {
        const downloadIds = ids.slice(i, i + 10)
        await Promise.all(downloadIds.map(({ id, name }, index) => {
          // 音乐名字中可能包含特殊字符，需要过滤
          name = sanitize(name)
          if (existsSync(path.join(downloadDir, `${name}.mp3`))) {
            logger.info(`index: ${i + index} 音乐 ${name} 已存在, 跳过下载`)
            skipList.push({ id, name })
            return Promise.resolve()
          }

          return Music.song_download_url({ id, cookie })
            .then(res => (res.body.data as any).url as string)
            .then(url => axios.get(url, { responseType: 'stream' }))
            .then((res) => {
              // 如果目录不存在，则创建目录
              if (!existsSync(downloadDir))
                mkdirSync(downloadDir, { recursive: true })
              const writer: Readable = res.data.pipe(createWriteStream(path.join(downloadDir, `${name}.mp3`)))

              return new Promise<void>((resolve, reject) => {
                writer.on('finish', (...args) => {
                  successList.push({ id, name })
                  resolve(...args)
                })
                writer.on('error', (err) => {
                  failList.push({ id, name })
                  reject(err)
                })
              })
            })
            .then(() => logger.info(`index: ${i + index} 音乐 ${name} 下载成功`))
            .catch((err) => {
              logger.error(`index: ${i + index} 音乐 ${name} 下载失败: ${err.message}`)
              failList.push({ id, name })
            })
        }))
      }

      logger.log()
      logger.log()
      logger.log('============================================================')
      logger.log('!!!!!!!!!!!!!!!!!!!!!!!!!下载完成!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      logger.log('============================================================')
      logger.info(`下载完成, 成功 ${successList.length} 首, 失败 ${failList.length} 首, 跳过 ${skipList.length} 首`)
      logger.log('============================================================')
      logger.log(`成功列表:`)
      if (successList.length > 0) {
        for (const { name, id } of successList)
          logger.info(`- ${name} id: ${id}`)
      }
      else {
        logger.info(`无下载成功的音乐`)
      }

      logger.log('============================================================')
      logger.log(`失败列表:`)
      if (failList.length > 0) {
        for (const { name, id } of failList)
          logger.error(`- ${name} id: ${id}`)
      }
      else {
        logger.info(`无下载失败的音乐`)
      }

      logger.log('============================================================')
      logger.log(`跳过列表:`)
      if (skipList.length > 0) {
        for (const { name, id } of skipList)
          logger.silly(`- ${name} id: ${id}`)
      }
      else {
        logger.info(`无跳过的音乐`)
      }
      logger.log('============================================================')
    },
  }
}
