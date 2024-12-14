declare interface Window {
  // extend the window
  electron: {
    request: (channel: string, ...args: any[]) => Promise<any>
  }
}

declare const __IS_SSG__: boolean
declare const isElectron: boolean

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
