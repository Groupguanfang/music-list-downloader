import * as api from '@neteasecloudmusicapienhanced/api'

// @ts-expect-error
const netease = api.default as unknown as typeof import('@neteasecloudmusicapienhanced/api')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response = await netease.playlist_track_all({
    id: body.id,
    cookie: body.cookie ?? getHeader(event, 'cookie') ?? '',
  })
  return response.body
})

