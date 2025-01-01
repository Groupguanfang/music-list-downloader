<script setup lang="tsx">
import { NTabPane, NTabs } from 'naive-ui'

const downloadPanel = useDownloadPanel()
const currentTab = ref<'zip' | 'file'>('zip')
const { createNewZipDialog } = useDownloadDialog()
</script>

<template>
  <NDrawer v-model:show="downloadPanel.isOpen" default-width="50%" resizable>
    <NDrawerContent>
      <NTabs v-model:value="currentTab" default-value="zip" type="card">
        <template #suffix>
          <NButton v-if="currentTab === 'zip'" size="small" @click="createNewZipDialog">新建压缩包</NButton>
        </template>
        <NTabPane name="zip" :tab="$t('my.download-zip')">
          <DownloadPanelZip />
        </NTabPane>
        <NTabPane name="file" :tab="$t('my.download-file')">
          开发中
        </NTabPane>
      </NTabs>
    </NDrawerContent>
  </NDrawer>
</template>

<style>
.n-drawer {
  backdrop-filter: blur(10px);
}
</style>
