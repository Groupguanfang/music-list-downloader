<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">下载音乐</h1>
      <div flex="~ gap-2 items-center">
        <span class="star-text">快给我点点 Star 👉</span>
        <NButton
          tag="a"
          href="https://github.com/Groupguanfang/music-list-downloader"
          target="_blank"
          rel="noopener noreferrer"
          type="default"
          quaternary
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="ml-1">GitHub</span>
        </NButton>
      </div>
    </div>
    
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
import { computed, ref } from 'vue'
import JSZip from 'jszip'
import { useMessage } from 'naive-ui'
import { useStorage, useCounter, useTimeoutFn } from '@vueuse/core'

// 设置页面标题
useHead({
  title: 'Music List Downloader'
})

const message = useMessage()

// 使用 useStorage 持久化 cookie 和配置
const cookie = useStorage('music-downloader-cookie', '')
const playlistId = useStorage('music-downloader-playlist-id', '')
const songId = useStorage('music-downloader-song-id', '')
const concurrentDownloads = useStorage('music-downloader-concurrent', 5)

// 使用 useCounter 管理计数
const { count: completedSongs, set: setCompletedSongs, inc: incCompletedSongs } = useCounter(0)
const { count: totalSongs, set: setTotalSongs } = useCounter(0)

// 下载状态不持久化，每次刷新重置
const isDownloading = ref(false)
const downloadProgress = ref(0)
const downloadStatus = ref('')

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

          // 通过服务器代理下载歌曲文件（解决跨域问题）
          const audioResponse = await fetch(`/api/proxy-audio?url=${encodeURIComponent(urlData.url)}`)
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
      // 通过服务器代理下载（解决跨域问题）
      const audioResponse = await fetch(`/api/proxy-audio?url=${encodeURIComponent(data.url)}`)
      if (!audioResponse.ok) {
        throw new Error(`HTTP ${audioResponse.status}`)
      }
      const audioBlob = await audioResponse.blob()
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'song.mp3'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
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

<style scoped>
.star-text {
  font-size: 16px;
  font-weight: 600;
  animation: color-change 2s ease-in-out infinite;
}

@keyframes color-change {
  0% {
    color: #ff6b6b;
  }
  14% {
    color: #4ecdc4;
  }
  28% {
    color: #45b7d1;
  }
  42% {
    color: #f9ca24;
  }
  56% {
    color: #f0932b;
  }
  70% {
    color: #eb4d4b;
  }
  84% {
    color: #6c5ce7;
  }
  100% {
    color: #ff6b6b;
  }
}
</style>

