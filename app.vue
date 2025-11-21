<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme="darkTheme">
    <NMessageProvider>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
import './styles/global.css'
</script>
