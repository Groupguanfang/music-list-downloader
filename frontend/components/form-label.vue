<script setup lang="tsx">
defineProps<{
  label: string
  description: string
}>()
</script>

<template>
  <div>
    <h2 select-none text-lg font-bold mb-1>
      {{ label }}
    </h2>
    <div select-none op-70>
      {{ description }}
    </div>
  </div>
</template>
