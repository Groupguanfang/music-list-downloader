<script setup lang="tsx">
import { DownloadListItem } from '~/stores/download'

defineProps<{
  task: DownloadListItem
}>()
</script>

<template>
  <div>
    <div flex="~ justify-between">
      <div>{{ task.name }}</div>
      <div>{{ $t(`my.download-status.${task.status}`) }}</div>
    </div>
    <NProgress :percentage="Number(task.percentage.toFixed(2))" />
  </div>
</template>
