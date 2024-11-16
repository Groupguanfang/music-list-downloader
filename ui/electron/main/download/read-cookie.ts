import path from 'node:path'
import fs from 'node:fs'
import { cwd } from 'node:process'

export function useReadCookie() {
  let cookie = ''
  const cookieDir = path.join(cwd(), './config/cookie.txt')
  if (!fs.existsSync(cookieDir))
    throw new Error(`没有在 ${cookieDir} 目录下找到 cookie.txt 文件。请手动创建 cookie.txt 文件`)
  cookie = fs.readFileSync(cookieDir, 'utf-8').toString()

  return {
    get cookie() {
      return cookie
    },
    get cookieDir() {
      return cookieDir
    },
  }
}
