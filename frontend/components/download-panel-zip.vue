<script setup lang="tsx">
const downloadStore = useDownloadStore()
const { createRenameZipDialog } = useDownloadDialog()
</script>

<template>
  <div flex="~ col gap-2">
    <div v-for="(zip, zipIndex) in downloadStore.operator.getZips()" :key="zipIndex">
      <div flex="~ items-center gap-1 justify-between">
        <div flex="~ items-center gap-1">
          <div font-size-4 i-ph-file-zip />
          <div font-size-4>{{ zip.getZipName() }}.zip</div>
        </div>
        <div flex="~ items-center gap-2">
          <NButton size="small" type="info" style="background-color: #70C0E8" @click="createRenameZipDialog(zip)">重命名</NButton>
          <NButton size="small" type="error" style="background-color: #E88080">删除</NButton>
        </div>
      </div>

      <div v-for="(item, itemIndex) in zip.getItems()" :key="itemIndex">
        <div flex="~ items-center gap-1">
          <div font-size-4 i-ph-file />
          <div font-size-4>{{ item.getFilename() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
