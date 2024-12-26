<script setup lang="tsx">
import { SongListDetailResponse } from '#/song-list.protocol'
import { useMusicController } from '~/apis/music'

defineOptions({ name: 'PlayListDetail' })

const cookie = useLocalStorage('__naily:music-downloader-cookie__', undefined)
const route = useRoute()
const { id } = route.params as { id: string }

const musicController = useMusicController()
const songListDetail = ref<Partial<SongListDetailResponse>>({})
musicController.songList.getSongListDetail({ id, cookie: cookie.value }).then(response =>
  songListDetail.value = response,
)
</script>

<template>
  <div min-h-screen>
    <div flex="~">
      <SkeletonImage
        class="size-20 md:size-50 min-w-20 md:min-w-50 transition-all rounded-xl"
        skeleton-class="size-20 md:size-50" :src="songListDetail.cover"
      />
      <div ml-4>
        <NSkeleton v-if="!songListDetail.name" mt-3 w-md h-7 rounded-sm transition-all />
        <div v-show="songListDetail.name" mt-3 font-bold text-lg md:text-xl text-black dark:text-white transition-all>
          {{ songListDetail.name }}
        </div>
        <NSkeleton v-if="!songListDetail.name" mt-2 w-md h-5 rounded-sm transition-all />
        <div v-show="songListDetail.name" text-size-sm mt-2 text-gray-500 dark:text-gray-400 transition-all>
          {{ songListDetail.description }}
        </div>
        <div v-if="!songListDetail.name" mt-2 flex="~ items-center gap-2">
          <NSkeleton w-20 h-9 rounded-md transition-all />
          <NSkeleton w-20 h-9 rounded-md transition-all />
        </div>
        <div v-show="songListDetail.name" flex="~ items-center gap-2">
          <button mt-4 bg-red-5 transition-all color-white scale="hover:105 active:95" p="x4 y2" rounded-md>
            {{ $t('play-list-detail.replace-current-play-list') }}
          </button>
          <button mt-4 transition-all scale="hover:105 active:95" p="x4 y2" rounded-md class="bg-gray/20">
            {{ $t('play-list-detail.download-all') }}
          </button>
        </div>
      </div>
    </div>

    <div mt-4 pb-4 flex="~ col gap-1">
      <SongListItem v-for="(item, index) in songListDetail.songs || []" :key="index" :song="item" />
    </div>
  </div>
</template>
