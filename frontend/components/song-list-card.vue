<script setup lang="tsx">
import type { PersonalizedSongListResponseResult } from '../../common/music.protocol'

const props = defineProps<PersonalizedSongListResponseResult>()

const emit = defineEmits<{
  click: [ev: MouseEvent, props: PersonalizedSongListResponseResult]
}>()

const isLoaded = ref(false)
const cardRef = ref<HTMLImageElement | null>(null)
const { width: imageWidth } = useElementBounding(cardRef)
</script>

<template>
  <div ref="cardRef" class="song-list-card" mb-4 relative cursor-pointer @click="(e) => emit('click', e, props)">
    <NSkeleton v-if="!isLoaded" w-full h-full rounded-lg :style="{ 'min-height': `${imageWidth}px` }" />
    <img v-show="isLoaded" rounded-lg w-full h-full transition-all class="cover" :src="props.cover" alt="cover" @load="isLoaded = true">
    <div
      class="layer hidden! md:flex!" text="white center"
      p3 select-none transition-all op-0 absolute top-0 left-0 w-full h-full scale-90 hover:scale-100
      flex="~ col items-center justify-center"
    >
      {{ name || (isLoaded ? '' : '加载音乐中...') }}
    </div>
    <div
      class="bordered" op-0
      absolute top-0 left-0 w-full h-full select-none pointer-events-none
      flex="~ col items-center justify-center"
    >
      <div class="w-90% h-90% content" border="1 solid white" />
    </div>
    <div block md:hidden>
      {{ name || (isLoaded ? '' : '加载音乐中...') }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.bordered .content {
  transition: ease-in-out 0.3s;
  opacity: 0;
}

.song-list-card {
  @apply transition-all;
}

.song-list-card:hover {
  @apply md:hover:shadow-2xl md:hover:scale-99;

  .cover {
    @apply filter md:brightness-65;
  }

  .layer {
    @apply op-100;
  }

  .bordered .content {
    transform: scale(0.9);
    transition: ease-in-out 0.3s;
    opacity: 0.3;
  }
}

.song-list-card:active {
  @apply scale-95! transition-all md:shadow-xl;

  .cover {
    @apply filter brightness-50;
  }
}
</style>
