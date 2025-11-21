<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
</script>
