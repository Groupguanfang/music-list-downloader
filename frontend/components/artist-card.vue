<script setup lang="tsx">
import { PersonalizedArtistsResponseResult } from '../../common/artist.protocol'

const props = defineProps<PersonalizedArtistsResponseResult>()

const emit = defineEmits<{
  click: [MouseEvent, PersonalizedArtistsResponseResult]
}>()
</script>

<template>
  <div cursor-pointer flex="~ col items-center gap-2">
    <img
      hover:shadow-2xl hover:scale-103 active:shadow-lg active:scale-99 transition-all-200 size-40 rounded-full select-none
      :src="`${avatar}?param=200y200`" alt="avatar" @click="(e) => emit('click', e, props)"
    >
    <div font="size-4">
      {{ name }}
    </div>
  </div>
</template>
