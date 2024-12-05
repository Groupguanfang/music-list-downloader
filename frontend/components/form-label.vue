<script setup lang="tsx">
defineProps<{
  label: string
  description: string
}>()
</script>

<template>
  <div>
    <h2 text-lg font-bold mb-1>
      {{ label }}
    </h2>
    <div op-70>
      {{ description }}
    </div>
  </div>
</template>
