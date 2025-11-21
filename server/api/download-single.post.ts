import * as api from '@neteasecloudmusicapienhanced/api'

// @ts-expect-error
const netease = api.default as unknown as typeof import('@neteasecloudmusicapienhanced/api')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response = await netease.song_url_v1({
    id: body.id,
    level: 'exhigh' as api.SoundQualityType,
    cookie: body.cookie ?? getHeader(event, 'cookie') ?? '',
  })
  return {
    // @ts-expect-error
    url: response.body.data[0].url
  }
})

