<script setup lang="tsx">
import { CheckQrCodeResponseType } from '#/music.protocol'
import { match } from 'ts-pattern'
import { useMusicController } from '~/apis/music'

const router = useRouter()
const cookie = useLocalStorage('__naily:music-downloader-cookie__', '')
const musicController = useMusicController()

const currentKey = ref<string | number>('')
const currentQrCodeBase64 = ref<string>('')
const qrCodeLoaded = ref<boolean>(false)
let qrCodeCheckInterval: NodeJS.Timeout | null = null
musicController.user.createQrCode().then((response) => {
  currentKey.value = response.key
  currentQrCodeBase64.value = response.base64
  return response.key
}).then(() => qrCodeCheckInterval = setInterval(() => check(), 3000))

function check() {
  musicController.user.checkQrCode(currentKey.value).then(response =>
    match(response.type).with(CheckQrCodeResponseType.Success, () => {
      cookie.value = response.cookie
      router.push('/my')
      clearInterval(qrCodeCheckInterval!)
    }).otherwise(v =>
      v === CheckQrCodeResponseType.Expired && clearInterval(qrCodeCheckInterval!),
    ),
  )
}
</script>

<template>
  <div flex="~ col items-center">
    <div mt-30>
      <div v-if="!qrCodeLoaded">
        Loading...
      </div>
      <img v-show="qrCodeLoaded" select-none pointer-events-none w-50 h-50 rounded-xl :src="currentQrCodeBase64" @load="qrCodeLoaded = true">
    </div>
    <div select-none pointer-events-none>
      请使用网易云APP扫码后登录
    </div>
  </div>
</template>
