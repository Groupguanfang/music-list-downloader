<script setup lang="tsx">
const downloadStore = useDownloadStore()
const downloadPanel = useDownloadPanel()
</script>

<template>
  <NDrawer v-model:show="downloadPanel.isOpen" width="50%">
    <NDrawerContent :title="$t('my.download-list')">
      <div w-full class="flex col gap-4 justify-center">
        <div v-for="(belong, belongIndex) in downloadStore.belongs" :key="belongIndex" w-full flex="~ col gap-4">
          <h3 font-size-lg>
            {{ belong }}
          </h3>
          <TaskCard v-for="(task, taskIndex) in downloadStore.getBelongTasks(belong)" :key="taskIndex" :task="task" />
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
