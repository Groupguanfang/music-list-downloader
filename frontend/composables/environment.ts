export function useEnvironment() {
  const isElectron = ref(false)
  const platform = ref<NodeJS.Platform | null>(null)

  onMounted(() => {
    if (window.electron) {
      isElectron.value = true
      window.electron.getPlatform().then(currentPlatform => platform.value = currentPlatform)
    }
  })

  return {
    isElectron,
    platform,
  }
}
