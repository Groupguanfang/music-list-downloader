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

    <!-- 下载进度弹窗 -->
    <NModal
      v-model:show="showDownloadModal"
      :mask-closable="false"
      :close-on-esc="false"
      preset="card"
      title="下载进度"
      style="width: 600px; max-width: 90vw;"
      :closable="false"
    >
      <NSpace vertical :size="16">
        <!-- 总体进度 -->
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-sm">{{ downloadStatus }}</span>
            <span class="text-sm font-semibold">{{ completedSongs }} / {{ totalSongs }}</span>
          </div>
          <NProgress
            type="line"
            :percentage="progressPercentage"
            :show-indicator="true"
          />
        </div>

        <!-- 统计信息 -->
        <div class="flex gap-4 text-sm">
          <div>
            <span>成功: </span>
            <span class="text-green-600 font-semibold">{{ successSongs.length }}</span>
          </div>
          <div>
            <span>失败: </span>
            <span class="text-red-600 font-semibold">{{ failedSongs.length }}</span>
          </div>
          <div>
            <span>进行中: </span>
            <span class="text-blue-600 font-semibold">
              {{ downloadStatusList.filter(s => s.status === 'downloading').length }}
            </span>
          </div>
        </div>

        <!-- 下载列表 -->
        <div class="max-h-96 overflow-y-auto overflow-x-hidden">
          <NList>
            <NListItem v-for="(item, index) in downloadStatusList" :key="index">
              <div class="flex items-center justify-between w-full">
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">
                    {{ item.song.name }}
                  </div>
                  <div class="text-xs opacity-70 truncate">
                    {{ item.song.ar?.map(a => a.name).join(', ') || '未知艺术家' }}
                  </div>
                </div>
                <div class="ml-4 flex items-center gap-2">
                  <svg
                    v-if="item.status === 'success'"
                    class="w-5 h-5 text-green-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <svg
                    v-else-if="item.status === 'failed'"
                    class="w-5 h-5 text-red-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                  <NSpin v-else-if="item.status === 'downloading'" size="small" />
                  <span v-else class="opacity-60 text-xs">等待中</span>
                </div>
              </div>
              <div v-if="item.status === 'failed' && item.error" class="mt-1 text-xs text-red-500">
                错误: {{ item.error }}
              </div>
            </NListItem>
          </NList>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-2">
          <NButton
            v-if="!isDownloading"
            type="primary"
            @click="showDownloadModal = false"
          >
            关闭
          </NButton>
        </div>
      </NSpace>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import JSZip from 'jszip'
import { useMessage, NModal, NList, NListItem, NSpin } from 'naive-ui'
import { useStorage, useCounter, useTimeoutFn } from '@vueuse/core'

// 设置页面标题
useHead({
  title: 'Music List Downloader'
})

const message = useMessage()

// API 基础地址
const API_BASE_URL = 'https://server.xhhzs.cn'

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

// 弹窗状态
const showDownloadModal = ref(false)

// 下载详情
interface SongDownloadStatus {
  song: Song
  status: 'pending' | 'downloading' | 'success' | 'failed'
  error?: string
  fileName?: string
}

const downloadStatusList = ref<SongDownloadStatus[]>([])
const successSongs = computed(() => downloadStatusList.value.filter(s => s.status === 'success'))
const failedSongs = computed(() => downloadStatusList.value.filter(s => s.status === 'failed'))

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

    // 1. 获取所有歌曲 - 直接请求 server.xhhzs.cn
    const params = new URLSearchParams({
      id: String(playlistId.value),
    })
    const trackResponse = await fetch(`${API_BASE_URL}/playlist/track/all?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Cookie': cookie.value,
      },
    })
    
    if (!trackResponse.ok) {
      throw new Error(`获取歌单失败: ${trackResponse.statusText}`)
    }
    
    const trackData = await trackResponse.json()
    
    // 解析歌曲列表
    const songs: Song[] = trackData.songs || trackData.data?.songs || []
    if (songs.length === 0) {
      message.warning('歌单中没有歌曲')
      isDownloading.value = false
      return
    }

    setTotalSongs(songs.length)
    setCompletedSongs(0)
    downloadStatus.value = `找到 ${songs.length} 首歌曲，开始并发下载（并发数: ${concurrentDownloads.value}）...`

    // 初始化下载状态列表
    downloadStatusList.value = songs.map(song => ({
      song,
      status: 'pending' as const
    }))
    
    // 显示弹窗
    showDownloadModal.value = true

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
        // 更新状态为下载中
        const statusItem = downloadStatusList.value.find(s => s.song.id === song.id)
        if (statusItem) {
          statusItem.status = 'downloading'
        }
        
        try {
          // 获取歌曲下载URL - 直接请求 server.xhhzs.cn
          const urlParams = new URLSearchParams({
            id: String(song.id),
            level: 'exhigh',
          })
          const urlResponse = await fetch(`${API_BASE_URL}/song/url/v1?${urlParams.toString()}`, {
            method: 'GET',
            headers: {
              'Cookie': cookie.value,
            },
          })
          
          if (!urlResponse.ok) {
            throw new Error(`获取下载链接失败: ${urlResponse.statusText}`)
          }
          
          const urlData = await urlResponse.json()
          const audioUrl = urlData?.data?.[0]?.url || urlData?.url
          
          if (!audioUrl || typeof audioUrl !== 'string' || audioUrl.length === 0) {
            throw new Error(`无法获取下载链接`)
          }

          // 直接下载歌曲文件（server.xhhzs.cn 已处理跨域）
          const audioResponse = await fetch(audioUrl.replace('http://', 'https://'))
          if (!audioResponse.ok) {
            throw new Error(`HTTP ${audioResponse.status}`)
          }
          const audioBlob = await audioResponse.blob()

          // 生成文件名
          const artistName = song.ar?.map((a: { name: string }) => a.name).join(', ') || '未知艺术家'
          const fileName = `${sanitizeFileName(song.name)} - ${sanitizeFileName(artistName)}.mp3`
          
          // 更新状态为成功
          if (statusItem) {
            statusItem.status = 'success'
            statusItem.fileName = fileName
          }
          
          return {
            fileName,
            blob: audioBlob,
            songName: song.name
          } as DownloadedSong & { songName: string }
        } catch (error) {
          console.error(`下载歌曲 ${song.name} 时出错:`, error)
          // 更新状态为失败
          if (statusItem) {
            statusItem.status = 'failed'
            statusItem.error = error instanceof Error ? error.message : String(error)
          }
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
    // 直接请求 server.xhhzs.cn
    const params = new URLSearchParams({
      id: String(songId.value),
      level: 'exhigh',
    })
    const response = await fetch(`${API_BASE_URL}/song/url/v1?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Cookie': cookie.value,
      },
    })
    
    if (!response.ok) {
      throw new Error(`获取下载链接失败: ${response.statusText}`)
    }
    
    const data = await response.json()
    const audioUrl = data?.data?.[0]?.url || data?.url
    
    if (audioUrl) {
      // 直接下载（server.xhhzs.cn 已处理跨域）
      const a = document.createElement('a')
      a.href = audioUrl
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

