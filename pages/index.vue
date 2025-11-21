<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">下载音乐</h1>
    
    <NForm :model="{}" label-placement="top" class="mb-6">
      <NFormItem label="请粘贴你的Cookie">
        <NInput
          v-model:value="cookie"
          type="textarea"
          placeholder="粘贴你的Cookie"
          :rows="3"
          :disabled="isDownloading"
        />
      </NFormItem>
    </NForm>

    <NSpace vertical :size="24">
      <NCard title="歌单下载">
        <NSpace vertical :size="16">
          <NFormItem label="并发下载数量（建议 3-10，默认 5）">
            <NInputNumber
              v-model:value="concurrentDownloads"
              :min="1"
              :max="20"
              :disabled="isDownloading"
              class="w-full"
            />
          </NFormItem>
          
          <NSpace>
            <NInput
              v-model:value="playlistId"
              placeholder="请输入歌单ID"
              :disabled="isDownloading"
              class="flex-1"
            />
            <NButton
              type="primary"
              @click="downloadPlaylist"
              :loading="isDownloading"
              :disabled="isDownloading"
            >
              {{ isDownloading ? '下载中...' : '下载歌单' }}
            </NButton>
          </NSpace>
          
          <!-- 进度条 -->
          <div v-if="isDownloading">
            <NSpace vertical :size="8">
              <NSpace justify="space-between">
                <span class="text-sm text-gray-600">{{ downloadStatus }}</span>
                <span v-if="totalSongs > 0" class="text-sm text-gray-600">
                  {{ completedSongs }} / {{ totalSongs }}
                </span>
              </NSpace>
              <NProgress
                type="line"
                :percentage="progressPercentage"
                :show-indicator="true"
              />
            </NSpace>
          </div>
        </NSpace>
      </NCard>

      <NCard title="单曲下载">
        <NSpace>
          <NInput
            v-model:value="songId"
            placeholder="请输入单曲ID"
            :disabled="isDownloading"
            class="flex-1"
          />
          <NButton
            type="success"
            @click="downloadSong"
            :disabled="isDownloading"
          >
            下载单曲
          </NButton>
        </NSpace>
      </NCard>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import JSZip from 'jszip'
import { useMessage } from 'naive-ui'
import { useStorage, useCounter, useTimeoutFn } from '@vueuse/core'

const message = useMessage()

// 使用 useStorage 持久化 cookie
const cookie = useStorage('music-downloader-cookie', '')
const playlistId = useStorage('music-downloader-playlist-id', '')
const songId = useStorage('music-downloader-song-id', '')
const concurrentDownloads = useStorage('music-downloader-concurrent', 5)

// 使用 useCounter 管理计数
const { count: completedSongs, set: setCompletedSongs, inc: incCompletedSongs } = useCounter(0)
const { count: totalSongs, set: setTotalSongs } = useCounter(0)

const isDownloading = useStorage('music-downloader-is-downloading', false)
const downloadProgress = useStorage('music-downloader-progress', 0)
const downloadStatus = useStorage('music-downloader-status', '')

// 计算属性
const progressPercentage = computed(() => Math.round((completedSongs.value / totalSongs.value) * 100) || 0)

interface Song {
  id: number
  name: string
  ar: Array<{ name: string }>
  al: { name: string }
}

interface DownloadedSong {
  fileName: string
  blob: Blob
}

// 并发控制函数（保持原有逻辑，已使用 VueUse 的其他功能优化）
async function downloadWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  processor: (item: T, index: number) => Promise<R | null>,
  onProgress?: (completed: number, total: number) => void
): Promise<(R | null)[]> {
  const results: (R | null)[] = []
  let completed = 0
  let currentIndex = 0

  const workers: Promise<void>[] = []

  const processNext = async () => {
    while (currentIndex < items.length) {
      const index = currentIndex++
      const item = items[index]
      if (item === undefined) continue
      try {
        const result = await processor(item, index)
        results[index] = result
        completed++
        if (onProgress) {
          onProgress(completed, items.length)
        }
      } catch (error) {
        console.error(`处理第 ${index + 1} 项时出错:`, error)
        results[index] = null
        completed++
        if (onProgress) {
          onProgress(completed, items.length)
        }
      }
    }
  }

  // 启动指定数量的并发工作线程
  for (let i = 0; i < Math.min(concurrency, items.length); i++) {
    workers.push(processNext())
  }

  await Promise.all(workers)
  return results
}

const downloadPlaylist = async () => {
  if (!playlistId.value) {
    message.warning('请输入歌单ID')
    return
  }
  if (!cookie.value) {
    message.warning('请输入Cookie')
    return
  }

  try {
    isDownloading.value = true
    downloadProgress.value = 0
    downloadStatus.value = '正在获取歌单信息...'
    setCompletedSongs(0)

    // 1. 获取所有歌曲
    const trackResponse = await $fetch<any>('/api/track-all', {
      method: 'POST',
      body: {
        id: playlistId.value,
        cookie: cookie.value,
      },
    })
    
    // 解析歌曲列表
    const songs: Song[] = trackResponse.songs || trackResponse.data?.songs || []
    if (songs.length === 0) {
      message.warning('歌单中没有歌曲')
      isDownloading.value = false
      return
    }

    setTotalSongs(songs.length)
    setCompletedSongs(0)
    downloadStatus.value = `找到 ${songs.length} 首歌曲，开始并发下载（并发数: ${concurrentDownloads.value}）...`

    // 2. 创建JSZip实例
    const zip = new JSZip()

    // 生成文件名的辅助函数
    const sanitizeFileName = (name: string) => {
      return name.replace(/[<>:"/\\|?*]/g, '_').trim()
    }

    // 3. 并发下载歌曲
    const downloadedSongs = await downloadWithConcurrency(
      songs,
      concurrentDownloads.value,
      async (song: Song, index: number) => {
        try {
          // 获取歌曲下载URL
          const urlData = await $fetch<{ url: string }>('/api/download-single', {
            method: 'POST',
            body: {
              id: song.id,
              cookie: cookie.value,
            },
          })
          
          if (!urlData.url) {
            throw new Error(`无法获取下载链接`)
          }

          // 下载歌曲文件
          const audioResponse = await fetch(urlData.url)
          if (!audioResponse.ok) {
            throw new Error(`HTTP ${audioResponse.status}`)
          }
          const audioBlob = await audioResponse.blob()

          // 生成文件名
          const artistName = song.ar?.map((a: { name: string }) => a.name).join(', ') || '未知艺术家'
          const fileName = `${sanitizeFileName(song.name)} - ${sanitizeFileName(artistName)}.mp3`
          
          return {
            fileName,
            blob: audioBlob,
            songName: song.name
          } as DownloadedSong & { songName: string }
        } catch (error) {
          console.error(`下载歌曲 ${song.name} 时出错:`, error)
          return null as any // 返回null表示下载失败
        }
      },
      (completed, total) => {
        setCompletedSongs(completed)
        downloadStatus.value = `正在下载: ${completed} / ${total} 首歌曲已完成`
      }
    )

    // 4. 将下载的歌曲添加到zip
    downloadStatus.value = '正在添加到压缩包...'
    let successCount = 0
    for (const downloaded of downloadedSongs) {
      if (downloaded && downloaded.fileName && downloaded.blob) {
        zip.file(downloaded.fileName, downloaded.blob)
        successCount++
      }
    }

    // 5. 生成zip文件
    downloadStatus.value = `正在压缩文件... (成功下载 ${successCount} 首)`
    const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      // 压缩进度（可选）
    })

    // 6. 下载zip文件
    downloadStatus.value = '正在保存文件...'
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `歌单_${playlistId.value}_${Date.now()}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    downloadStatus.value = '下载完成！'
    message.success(`下载完成！成功下载 ${successCount} 首歌曲`)
    
    // 2秒后重置状态
    const { start, stop } = useTimeoutFn(() => {
      isDownloading.value = false
      downloadStatus.value = ''
      downloadProgress.value = 0
      setCompletedSongs(0)
      setTotalSongs(0)
    }, 2000)
    start()
  } catch (error) {
    console.error('下载歌单时出错:', error)
    message.error('下载失败: ' + (error instanceof Error ? error.message : String(error)))
    isDownloading.value = false
    downloadStatus.value = '下载失败'
  }
}

const downloadSong = async () => {
  if (!songId.value) {
    message.warning('请输入单曲ID')
    return
  }
  if (!cookie.value) {
    message.warning('请输入Cookie')
    return
  }
  try {
    const data = await $fetch<{ url: string }>('/api/download-single', {
      method: 'POST',
      body: {
        id: songId.value,
        cookie: cookie.value,
      },
    })
    if (data.url) {
      // 直接下载
      const a = document.createElement('a')
      a.href = data.url
      a.download = 'song.mp3'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      message.success('开始下载单曲')
    } else {
      message.error('无法获取下载链接')
    }
  } catch (error) {
    console.error(error)
    message.error('下载失败')
  }
}
</script>

