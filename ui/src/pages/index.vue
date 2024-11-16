<script setup lang="ts">
import { ipcRenderer } from 'electron'

const id = ref('')
const cookie = ref('')
const selectedDir = ref('')

function selectFolder(): void {
  ipcRenderer.send('open-directory-dialog', 'openDirectory')
  ipcRenderer.on('selectedItem', (_e, files) => {
    selectedDir.value = files
  })
}

function download(): void {
  ipcRenderer.send('download', { id: id.value, dir: selectedDir.value, cookie: cookie.value })
}

const logList = ref<string[]>([])
ipcRenderer.on('download:info', (_e, info) => {
  logList.value.push(info)
})
ipcRenderer.on('download:error', (_e, error) => {
  logList.value.push(error)
})
ipcRenderer.on('download:silly', (_e, silly) => {
  logList.value.push(silly)
})
ipcRenderer.on('download:log', (_e, log) => {
  logList.value.push(log)
})
</script>

<template>
  <div>
    <TheInput v-model="id" mb5 placeholder="请输入歌单id" />
    <TheInput v-model="cookie" placeholder="请粘贴您的cookie" />
    <div flex flex-col gap-5 items-center mt10>
      <button btn @click="selectFolder">
        选择一个文件夹，音乐文件将会下载到这里
      </button>
      <div v-if="selectedDir">
        当前已选择文件夹：{{ selectedDir }}
      </div>
      <button btn :disabled="!selectedDir || !id || !cookie" @click="download()">
        开始下载
      </button>

      <div v-for="(log, index) in logList" :key="index">
        {{ log }}
      </div>
    </div>
  </div>
</template>
