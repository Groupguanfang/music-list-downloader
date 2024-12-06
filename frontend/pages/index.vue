<script setup lang="tsx">
import { PersonalizedArtistsResponseResult, PersonalizedSongListResponseResult } from '#/music.protocol'
import { useMusicController } from '~/apis/music'

const router = useRouter()
const musicController = useMusicController()

const personalizedSongListResult = ref<PersonalizedSongListResponseResult[]>([])
await musicController.getPersonalizedSongLists().then(response =>
  personalizedSongListResult.value = response.result,
)

function handleSongListCardClick(e: MouseEvent, item: PersonalizedSongListResponseResult) {
  router.push(`/play-list/${item.id}`)
}

const personalizedArtistsResult = ref<PersonalizedArtistsResponseResult[]>([])
await musicController.getPersonalizedArtists({ limit: 12 }).then(response =>
  personalizedArtistsResult.value = response.result,
)

function handleArtistCardClick(e: MouseEvent, item: PersonalizedArtistsResponseResult) {
  router.push(`/artist/${item.id}`)
}
</script>

<template>
  <div>
    <h1 pointer-events-none select-none font-extrabold text="size-3xl md:size-2xl" flex="~ items-center gap-2">
      <div i-ph-list-numbers-duotone hidden md:block />
      {{ $t('home.popular-music-list') }}
    </h1>

    <div columns-2 md:columns-4 lg:columns-5 xl:columns-6 gap-4 mt-5>
      <SongListCard v-for="(item, index) in personalizedSongListResult" v-bind="item" :key="index" break-inside-avoid @click="handleSongListCardClick" />
    </div>

    <h1 mt-10 pointer-events-none select-none font-extrabold text="size-3xl md:size-2xl" flex="~ items-center gap-2">
      <div i-ph-user-duotone hidden md:block />
      {{ $t('home.top-artists') }}
    </h1>

    <div grid="~ cols-2 sm:cols-3 md:cols-4 xl:cols-6" gap-4 mt-5>
      <ArtistCard v-for="(item, index) in personalizedArtistsResult" v-bind="item" :key="index" @click="handleArtistCardClick" />
    </div>
  </div>
</template>
