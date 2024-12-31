<script setup lang="tsx">
defineProps<{
  label: string
  description: string
}>()
</script>

<template>
  <div>
    <h3 select-none text-lg font-bold mb-1>
      {{ label }}
    </h3>
    <div select-none op-70>
      {{ description }}
    </div>
  </div>
</template>
