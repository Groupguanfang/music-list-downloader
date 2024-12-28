<script setup lang="tsx">
import { ArtistDetailResponse } from '#/artist.protocol'
import { useMusicController } from '~/apis/music'

useHead({ title: '歌手详情 - 网易云音乐下崽器' })
const route = useRoute()
const { id } = route.params as { id: string }

const musicController = useMusicController()
const artistDetail = ref<Partial<ArtistDetailResponse>>({})
musicController.artist.getArtistDetail({ id: id || '000' }).then(response =>
  artistDetail.value = response,
)

const dataNumFields = computed(() => [
  { num: artistDetail.value.albumCount, label: '专辑数' },
  { num: artistDetail.value.singleSongCount, label: '单曲数' },
])
</script>

<script lang="tsx">
export default { name: 'ArtistDetail' }
</script>

<template>
  <div>
    <div pt-4 flex="~ gap-4 md:gap-7">
      <div max-w-30 max-h-30 md:min-w-50 md:min-h-50>
        <NImage :src="artistDetail.avatar" rounded-full />
      </div>

      <div flex="~ col gap-1" w-full>
        <!-- 标题:歌手名称，数据 -->
        <div flex="~ col md:row justify-between md:items-center">
          <div flex="~ col gap-1">
            <h1 font="bold size-8 md:size-10">
              {{ artistDetail.name }}
            </h1>
            <!-- 歌手别名 -->
            <div v-if="artistDetail.alias && artistDetail.alias.length > 0" font-size-3 flex="~ gap-2 items-center">
              别名:
              <div v-for="(alia, aliaIndex) in artistDetail.alias || []" :key="aliaIndex" op-70>
                {{ alia }}
              </div>
            </div>
          </div>

          <div flex="~ gap-4 items-center">
            <div v-for="(dataNumField, dataNumFieldIndex) in dataNumFields" :key="dataNumFieldIndex" flex="~ md:col gap-1 md:gap-0 items-baseline md:items-center">
              <div op-90 font="size-3">
                {{ dataNumField.label }}
              </div>
              <div font="900 size-4.5" class="num">
                {{ dataNumField.num }}
              </div>
            </div>
          </div>
        </div>

        <p op-70 hidden md:block>
          {{ artistDetail.description }}
        </p>
      </div>
    </div>

    <p op-70 md:hidden mt-5>
      {{ artistDetail.description }}
    </p>
  </div>
</template>

<style scoped>
.num {
  font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
}
</style>
