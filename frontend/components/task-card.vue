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
    <NProgress
      :percentage="Number(task.percentage.toFixed(2))"
      :status="task.status === 'failed' ? 'error' : 'default'"
      :show-indicator="task.status !== 'failed' && task.status !== 'finished'"
    />
  </div>
</template>
