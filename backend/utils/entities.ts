import type { Class } from '@nailyjs/ioc'
import type { Entities } from '@nailyjs/typeorm'

export function getEntities(): Entities {
  const isClass = (value: any): value is Class => {
    return typeof value === 'function' && /^\s*class\s+/.test(value.toString())
  }

  // 因为目前处于`vite`环境下 我们可以利用vite里的`import.meta.glob`宏函数，动态导入所有的models文件夹中的`class`
  // 这样可以避免手动维护`entities`数组，每次都加一堆一堆的`import`语句和`class`名字，非常方便
  const modelModules: Record<string, Record<string, unknown>> = import.meta.glob('../models/**/*.model.ts', { eager: true })
  // 这里的逻辑可以进一步细化，或者根据实际情况进行调整
  const entities = Object.values(modelModules)
    .map(module => Object.values(module))
    .flat()
    .filter(value => isClass(value))
  return entities
}
