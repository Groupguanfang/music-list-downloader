<script setup lang="tsx">
import { PersonalizedSongListResponseResult } from '#/music.protocol'
import { useMusicController } from '~/apis/music'

const router = useRouter()
const musicController = useMusicController()

const personalizedSongListResult = ref<PersonalizedSongListResponseResult[]>([])
await musicController.getPersonalizedSongLists().then(response =>
  personalizedSongListResult.value = response.result,
)

function handleSongListCardClick(e: MouseEvent, item: PersonalizedSongListResponseResult) {
  router.push(`/play-list/${item.id}/detail`)
}
</script>

<template>
  <div pt="10 md:7" pb-30>
    <h1 pointer-events-none select-none font-extrabold text="size-3xl md:size-2xl" flex="~ items-center gap-2">
      <div i-ph-list-numbers-duotone hidden md:block />
      {{ $t('popular-music-list') }}
    </h1>

    <div columns-2 md:columns-4 lg:columns-5 xl:columns-6 gap-4 mt-5>
      <SongListCard v-for="(item, index) in personalizedSongListResult" v-bind="item" :key="index" break-inside-avoid @click="handleSongListCardClick" />
    </div>
  </div>
</template>
