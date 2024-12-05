<script setup lang="tsx">
import { Song, SongListDetailResponse } from '#/music.protocol'
import { useMusicController } from '~/apis/music'

const cookie = useLocalStorage('__naily:music-downloader-cookie__', undefined)
const route = useRoute()
const { width: windowWidth } = useWindowSize()
const { id } = route.params as { id: string }

const musicController = useMusicController()
const songListDetail = ref<Partial<SongListDetailResponse>>({})
musicController.getSongListDetail({ id, cookie: cookie.value }).then(response =>
  songListDetail.value = response,
)

const listRightActionButtons = computed(() => [
  {
    icon: 'i-ph-play-duotone',
    text: '播放该歌曲',
    onClick: (_e: MouseEvent, _item: Song) => void 0,
  },
  {
    text: '添加到播放列表',
    onClick: (_e: MouseEvent, _item: Song) => void 0,
    icon: 'i-ph-list-plus-duotone',
  },
  {
    icon: 'i-ph-download-duotone',
    text: '下载该歌曲',
    onClick: (_e: MouseEvent, _item: Song) => void 0,
  },
])
</script>

<template>
  <div min-h-screen>
    <div flex="~">
      <SkeletonImage class="size-20 md:size-50 transition-all rounded-xl" skeleton-class="size-20 md:size-50" :src="songListDetail.cover" />
      <div ml-4>
        <NSkeleton v-if="!songListDetail.name" mt-3 w-md h-7 rounded-sm transition-all />
        <div v-show="songListDetail.name" mt-3 font-bold text-lg md:text-xl text-black dark:text-white transition-all>
          {{ songListDetail.name }}
        </div>
        <NSkeleton v-if="!songListDetail.name" mt-2 w-md h-5 rounded-sm transition-all />
        <div v-show="songListDetail.name" text-size-sm text-size-lg mt-2 text-gray-500 dark:text-gray-400 transition-all>
          {{ songListDetail.description }}
        </div>
        <div v-if="!songListDetail.name" mt-2 flex="~ items-center gap-2">
          <NSkeleton w-20 h-9 rounded-md transition-all />
          <NSkeleton w-20 h-9 rounded-md transition-all />
        </div>
        <div v-show="songListDetail.name" flex="~ items-center gap-2">
          <button mt-4 bg-red-5 transition-all color-white scale="hover:105 active:95" p="x4 y2" rounded-md>
            替换播放列表
          </button>
          <button mt-4 transition-all scale="hover:105 active:95" p="x4 y2" rounded-md class="bg-gray/20">
            全部下载
          </button>
        </div>
      </div>
    </div>

    <div mt-4 pb-4 flex="~ col gap-4">
      <div
        v-for="(item, index) in songListDetail.songs || []" :key="index"
        class="hover:bg-gray/10 transition-all rounded-xl p-2"
        flex="~ justify-between col md:row gap-2"
      >
        <div flex="~ items-center gap-2">
          <NImage size="15" lazy transition-all rounded-xl width="100%" :img-props="{ style: { 'min-width': '3.75rem' } }" :src="item.cover">
            <template #placeholder>
              <NSkeleton w-15 h-15 rounded-xl transition-all />
            </template>
          </NImage>
          <div flex="~ col" my2>
            <div font="size-4 bold" flex="~ items-center gap-2">
              {{ item.name }}
              <div v-if="item.subTitle" op-60>
                {{ item.subTitle }}
              </div>
            </div>
            <div flex="~ gap-x-2 md:gap-2 items-center wrap">
              <div op="70 hover:100" transition-all cursor-pointer>
                id: {{ item.id }}
              </div>
              <div flex="~ items-center wrap">
                <div v-for="(artistItem, artistIndex) in item.artists" :key="artistIndex" flex="~ items-center">
                  <div op="70 hover:100" transition-all cursor-pointer>
                    {{ artistItem.name }}
                  </div>
                  <NDivider v-if="artistIndex !== item.artists.length - 1" vertical class="m-1!" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div hidden md:flex flex="~ items-center gap-1 wrap md:nowrap" mr-5>
          <NTooltip v-for="(rightBtnItem, rightBtnIndex) in listRightActionButtons" :key="rightBtnIndex" :trigger="windowWidth < 768 ? 'manual' : undefined">
            <template #trigger>
              <button p3 class="hover:bg-gray/20 rounded-md md:rounded-full hover:scale-105 transition-all active:scale-95" @click="(e) => rightBtnItem.onClick(e, item)">
                <div :class="`${rightBtnItem.icon} font-size-4.5`" />
                <div md:hidden>
                  {{ rightBtnItem.text }}
                </div>
              </button>
            </template>
            {{ rightBtnItem.text }}
          </NTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
