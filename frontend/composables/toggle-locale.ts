import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

export function useToggleLocale() {
  const { locale } = useI18n()

  async function toggleLocales(e?: MouseEvent) {
    if (e)
      return toggleWithAnimate(e, toggleLocales)
    // change to some real logic
    const locales = availableLocales
    const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
    await loadLanguageAsync(newLocale)
    locale.value = newLocale
  }

  return {
    toggleLocales,
  }
}
