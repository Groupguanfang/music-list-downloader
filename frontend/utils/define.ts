import defu from 'defu'
import { GlobalThemeOverrides } from 'naive-ui'

export function defineThemeOverrides(
  common?: GlobalThemeOverrides,
  lightTheme?: GlobalThemeOverrides,
  darkTheme?: GlobalThemeOverrides,
): [ComputedRef<GlobalThemeOverrides>, ComputedRef<GlobalThemeOverrides>] {
  return [
    computed(() => defu(common, lightTheme)),
    computed(() => defu(common, darkTheme)),
  ]
}
