<script setup lang="tsx">
import { UserSongListsResponse } from '#/song-list.protocol'
import { CurrentAccountResponse } from '#/user.protocol'
import { useMessage } from 'naive-ui'
import { useMusicController } from '~/apis/music'

useHead({ title: '我的 - 网易云音乐下崽器' })
const { t } = useI18n()
const router = useRouter()
const message = useMessage()
const musicController = useMusicController()
const cookie = useLocalStorage('__naily:music-downloader-cookie__', '')
if (!cookie.value) {
  message.error(t('common.no-login'))
  router.push('/login')
}

const result = ref<Partial<CurrentAccountResponse>>({})
const songLists = ref<Partial<UserSongListsResponse>>({
  songLists: [],
})

const avatarIsLoaded = ref(false)
async function requestAccountInfo() {
  await musicController.user.getCurrentAccount({ cookie: cookie.value })
    .then(response => result.value = response)
    .then(() => musicController.songList.getUserSongLists({ id: result.value.id! }))
    .then(response => songLists.value = response)
    .catch(() => {
      if (cookie.value) {
        cookie.value = undefined
        message.error(t('common.login-expired'))
      }
      router.push('/login')
    })
}
if (cookie.value)
  requestAccountInfo()
</script>

<script lang="tsx">
export default { name: 'My' }
</script>

<template>
  <div select-none flex="~ col gap-5 md:gap-10" pt5>
    <div flex="~ col md:row md:items-center justify-between gap-2">
      <!-- Left -->
      <div flex="~ items-center gap-2">
        <NSkeleton v-if="!avatarIsLoaded" transition-all size-18 md:size-15 rounded-full />
        <img v-show="avatarIsLoaded" transition-all size-18 md:size-15 rounded-full :src="result.avatar" @load="avatarIsLoaded = true">
        <div flex="~ col">
          <h1 font="size-lg md:size-3xl bold">{{ result.name }}</h1>
          <p op-60 block md:hidden>{{ result.signature }}</p>
        </div>
      </div>
      <!-- Right -->
      <p op-60 hidden md:block>{{ result.signature }}</p>
    </div>

    <div flex="~ col gap-4" w-full>
      <h2 font="size-lg md:size-2xl bold" flex="~ items-center gap-2">
        <div i-ph-list-numbers-duotone hidden md:block />
        {{ $t('my.music-list') }}
      </h2>

      <div columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-4>
        <SongListCard
          v-for="(item, index) in songLists.songLists" v-bind="item" :key="index" break-inside-avoid
          @click="$router.push(`/play-list/${item.id}`)"
        />
      </div>
    </div>
  </div>
</template>
