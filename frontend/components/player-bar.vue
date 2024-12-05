<script setup lang="tsx">
import { usePlaylist } from 'vue-music-playlist'

const playlist = ref([])
const { currentSong } = usePlaylist({
  initialPlayMethod: 'circle',
  initialPlaylist: playlist,
})
</script>

<template>
  <div p5 bg-white dark:bg-red-900 fixed bottom-0 left-0 w-full border-t="~ 1 solid gray-300 dark:gray-800">
    当前播放 {{ currentSong }}
  </div>
</template>
