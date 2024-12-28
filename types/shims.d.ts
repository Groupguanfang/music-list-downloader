declare interface GlobalElectron {
  request: (channel: string, ...args: any[]) => Promise<any>
  closeWindow: () => void
  minimizeWindow: () => void
  maximizeWindow: () => void
  getPlatform: () => Promise<NodeJS.Platform>
}

declare interface Window {
  // extend the window
  electron: GlobalElectron
}

declare const __IS_SSG__: boolean

// with unplugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}
