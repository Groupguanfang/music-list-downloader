import type { UserModule } from '~/types'
import { createPinia } from 'pinia'

// Setup Pinia
// https://pinia.vuejs.org/
export const install: UserModule = async ({ isClient, initialState, app }) => {
  const pinia = createPinia()
  if (isClient)
    pinia.use((await import('pinia-plugin-persistedstate')).default)

  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  if (isClient)
    pinia.state.value = (initialState.pinia) || {}

  else
    initialState.pinia = pinia.state.value
}
