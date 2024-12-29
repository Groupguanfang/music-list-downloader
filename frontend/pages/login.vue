<script setup lang="tsx">
import { CheckQrCodeResponseType } from '#/user.protocol'
import { match } from 'ts-pattern'
import { useMusicController } from '~/apis/music'

useHead({ title: '登录 - 网易云音乐下崽器' })
const { locale } = useI18n()
const router = useRouter()
const cookie = useLocalStorage('__naily:music-downloader-cookie__', '')
const musicController = useMusicController()

const currentKey = ref<string | number>('')
const currentQrCodeBase64 = ref<string>('')
const qrCodeLoaded = ref<boolean>(false)
const clientNames = ref<Record<string, string>>({})

let qrCodeCheckInterval: NodeJS.Timeout | null = null
function createQrCode() {
  musicController.user.createQrCode().then((response) => {
    currentKey.value = response.key
    currentQrCodeBase64.value = response.base64
    clientNames.value = response.name
  }).then(() => qrCodeCheckInterval = setInterval(() => check(), 3000))
}
createQrCode()

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
      <img
        v-show="qrCodeLoaded" class="fade-in-20"
        select-none pointer-events-none w-50 h-50 rounded-xl
        :src="currentQrCodeBase64" @load="qrCodeLoaded = true"
      >
    </div>
    <div mt-2 dark:mt-3 class="fade-in" select-none pointer-events-none>
      {{ $t('login.please-use-client-scan', { clientName: clientNames[locale] }) }}
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fade-in 0.5s ease-in-out;
  opacity: 0.9;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 0.9;
    transform: translateY(0);
  }
}

.fade-in-20 {
  animation: fade-in-20 0.5s ease-in-out;
  opacity: 0.9;
}

@keyframes fade-in-20 {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 0.9;
    transform: translateY(0);
  }
}
</style>
