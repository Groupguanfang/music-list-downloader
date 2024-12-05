<script setup lang="tsx">
import { CurrentAccountResponse, UserSongListsResponse } from '#/music.protocol'
import { useMusicController } from '~/apis/music'

const router = useRouter()
const musicController = useMusicController()
const cookie = useLocalStorage('__naily:music-downloader-cookie__', '')
if (!cookie.value)
  router.push('/login')

const result = ref<Partial<CurrentAccountResponse>>({})
const songLists = ref<Partial<UserSongListsResponse>>({
  songLists: [],
})
musicController.user.getCurrentAccount({ cookie: cookie.value }).then(response =>
  result.value = response,
).then(() => musicController.getUserSongLists({ id: result.value.id! })).then(response =>
  songLists.value = response,
)

const avatarIsLoaded = ref(false)
</script>

<template>
  <div flex="~ col md:row gap-5 md:gap-10" pt5>
    <aside flex="~ md:col gap-5 items-center md:items-start" min-w-60>
      <NSkeleton v-if="!avatarIsLoaded" transition-all size-20 md:size-60 rounded-full mb-4 />
      <img v-show="avatarIsLoaded" transition-all size-20 md:size-60 rounded-full mb-4 :src="result.avatar" @load="avatarIsLoaded = true">
      <div flex="~ col">
        <!-- eslint-disable-next-line -->
        <h1 font="size-lg md:size-2xl bold">{{ result.name }}</h1>
        <!-- eslint-disable-next-line -->
        <p op-60>{{ result.signature }}</p>
      </div>
    </aside>

    <div flex="~ col gap-4" w-full>
      <h2 font="size-lg md:size-2xl bold">
        {{ $t('my.music-list') }}
      </h2>

      <div columns-2 md:columns-2 lg:columns-4 xl:columns-5 gap-4>
        <SongListCard
          v-for="(item, index) in songLists.songLists" v-bind="item" :key="index" break-inside-avoid
          @click="$router.push(`/play-list/${item.id}/detail`)"
        />
      </div>
    </div>
  </div>
</template>
