// these APIs are auto-imported from @vueuse/core
export const isDark = useDark()
export const preferredDark = usePreferredDark()
const toggleDarkToggler = useToggle(isDark)

function isEnableTransitions() {
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

export async function toggleWithAnimate({ clientX: x, clientY: y }: MouseEvent, action: () => any) {
  if (!isEnableTransitions())
    return action()

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )}px at ${x}px ${y}px)`,
  ]

  await document.startViewTransition(async () => {
    action()
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: !isDark ? clipPath.reverse() : clipPath },
    {
      duration: 500,
      easing: 'ease-in-out',
      pseudoElement: `::view-transition-new(root)`,
    },
  )
}

export function toggleDark(v?: boolean, e?: MouseEvent) {
  if (e)
    return toggleWithAnimate(e, () => toggleDark(v))
  return toggleDarkToggler(v)
}
