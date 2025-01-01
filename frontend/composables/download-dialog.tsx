import { NInput, NInputGroup, NInputGroupLabel, useDialog, useMessage } from 'naive-ui'
import { DownloadZipImpl } from '~/classes/download-zip'

// TODO: 需要优化，目前有warn:
// [Vue warn]: Non-function value encountered for default slot. Prefer function slots for better performance.
export function useDownloadDialog() {
  const dialog = useDialog()
  const message = useMessage()
  const downloadStore = useDownloadStore()

  const zipName = ref('')
  function createNewZipDialog() {
    dialog.create({
      title: '新建压缩包',
      content: () => (
        <NInputGroup>
          <NInput
            defaultValue={zipName.value}
            onChange={v => zipName.value = v}
            placeholder="请输入压缩包名称"
          />
          <NInputGroupLabel>.zip</NInputGroupLabel>
        </NInputGroup>
      ),
      positiveText: '创建',
      negativeText: '取消',
      onPositiveClick: () => {
        if (!zipName.value)
          return message.error('请输入压缩包名称')
        downloadStore.operator.addZip(zipName.value)
        zipName.value = ''
      },
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      positiveButtonProps: { style: { 'background-color': '#63E2B8' } },
    })
  }

  const renameZipName = ref('')
  function createRenameZipDialog(zip: DownloadZipImpl) {
    dialog.create({
      title: '重命名压缩包',
      content: () => (
        <NInputGroup>
          <NInput
            defaultValue={renameZipName.value}
            onChange={v => renameZipName.value = v}
            placeholder="请输入压缩包名称"
          />
          <NInputGroupLabel>.zip</NInputGroupLabel>
        </NInputGroup>
      ),
      positiveText: '重命名',
      negativeText: '取消',
      onPositiveClick: () => {
        if (!renameZipName.value)
          return message.error('请输入压缩包名称')
        zip.replaceZipName(renameZipName.value)
        renameZipName.value = ''
      },
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      positiveButtonProps: { style: { 'background-color': '#63E2B8' } },
    })
  }

  return {
    createNewZipDialog,
    createRenameZipDialog,
  }
}
