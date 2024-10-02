import path from 'node:path'
import fs from 'node:fs'
import { cwd } from 'node:process'

export function useReadCookie() {
  let cookie = ''
  const cookieDir = path.join(cwd(), './config/cookie.txt')
  if (!fs.existsSync(cookieDir))
    throw new Error(`Cookie file not found at ${cookieDir}`)
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
