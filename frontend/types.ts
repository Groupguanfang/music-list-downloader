import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void | Promise<void>

export function typeAssert<T>(value: unknown): asserts value is T {}
