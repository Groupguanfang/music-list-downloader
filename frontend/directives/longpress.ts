import { Directive } from 'vue'

export const vLongpress: Directive<HTMLElement, (e: TouchEvent) => any> = {
  mounted(el: HTMLElement, binding) {
    let pressTimer: NodeJS.Timeout | string | number | undefined

    el.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        if (pressTimer)
          binding.value(e)
      }, 1000)
    })

    el.addEventListener('touchend', () => {
      clearTimeout(pressTimer)
      pressTimer = undefined
    })
  },
}
