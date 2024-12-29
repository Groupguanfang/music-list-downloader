export function useProxy() {
  const proxyRules = useLocalStorage('mld:proxy-rules', '')
  const proxyRulesInput = ref('')

  onMounted(() => {
    if (proxyRules.value)
      proxyRulesInput.value = proxyRules.value
  })

  function setProxy() {
    window.electron.setProxy(proxyRulesInput.value)
    proxyRules.value = proxyRulesInput.value
  }
  const closeProxy = () => window.electron.closeProxy()

  return {
    proxyRules,
    proxyRulesInput,
    setProxy,
    closeProxy,
  }
}
