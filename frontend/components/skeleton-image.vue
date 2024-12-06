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
  <NImage v-show="isLoaded" v-bind="$attrs" :src="`${src}?param=200y200`" object-fit="cover" :preview-src="src" @load="isLoaded = true" />
</template>
