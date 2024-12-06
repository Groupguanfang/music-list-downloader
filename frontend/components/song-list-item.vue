<script setup lang="tsx">
import { Song } from '#/music.protocol'
import { vLongpress } from '~/directives/longpress'

defineProps<{
  song: Song
}>()

const { t } = useI18n()
const { width: windowWidth } = useWindowSize()

const listRightActionButtons = computed(() => [
  {
    icon: 'i-ph-play-duotone',
    text: t('play-list-detail.item-action.play'),
    onClick: (_e: MouseEvent, _item: Song) => void 0,
  },
  {
    text: t('play-list-detail.item-action.push-to-play-list'),
    onClick: (_e: MouseEvent, _item: Song) => void 0,
    icon: 'i-ph-list-plus-duotone',
  },
  {
    icon: 'i-ph-download-duotone',
    text: t('play-list-detail.item-action.download'),
    onClick: (_e: MouseEvent, _item: Song) => void 0,
  },
])
</script>

<template>
  <div v-longpress="() => console.log('444')" class="hover:bg-gray/10 transition-all rounded-xl p-2" flex="~ justify-between col md:row gap-2">
    <div flex="~ items-center gap-2">
      <NImage size="15" lazy transition-all rounded-xl width="100%" :img-props="{ style: { 'min-width': '3.75rem' } }" :src="song.cover">
        <template #placeholder>
          <NSkeleton w-15 h-15 rounded-xl transition-all />
        </template>
      </NImage>
      <div flex="~ col" my2>
        <div font="size-4 bold" flex="~ items-center gap-x-2 wrap">
          {{ song.name }}
          <div v-if="song.subTitle" op-60 font-size="3.5 md:4">
            {{ song.subTitle }}
          </div>
        </div>
        <div flex="~ gap-x-2 md:gap-2 items-center wrap">
          <div op="70 hover:100" transition-all cursor-pointer>
            id: {{ song.id }}
          </div>
          <div flex="~ items-center wrap">
            <div v-for="(artistItem, artistIndex) in song.artists" :key="artistIndex" flex="~ items-center">
              <div op="70 hover:100" transition-all cursor-pointer>
                {{ artistItem.name }}
              </div>
              <NDivider v-if="artistIndex !== song.artists.length - 1" vertical class="m-1!" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden!" flex="~ md:! items-center gap-1 wrap md:nowrap" mr-5>
      <NTooltip v-for="(rightBtnItem, rightBtnIndex) in listRightActionButtons" :key="rightBtnIndex" :trigger="windowWidth < 768 ? 'manual' : undefined">
        <template #trigger>
          <button select-none p3 class="hover:bg-gray/20 rounded-md md:rounded-full hover:scale-105 transition-all active:scale-95" @click="(e) => rightBtnItem.onClick(e, song)">
            <div :class="`${rightBtnItem.icon} font-size-4.5`" />
            <div md:hidden>
              {{ rightBtnItem.text }}
            </div>
          </button>
        </template>
        {{ rightBtnItem.text }}
      </NTooltip>
    </div>
  </div>
</template>
