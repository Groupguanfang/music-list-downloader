<script setup lang="ts">
export interface SkeletonImageProps {
  skeletonClass?: string
  src?: string
}

defineProps<SkeletonImageProps>()
const isLoaded = ref(false)
</script>

<template>
  <NSkeleton v-if="!isLoaded" size-full transition-all rounded-xl :class="skeletonClass" />
  <img v-show="isLoaded" v-bind="$attrs" :src="src" @load="isLoaded = true">
</template>
