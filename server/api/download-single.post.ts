import * as api from '@neteasecloudmusicapienhanced/api'

// @ts-expect-error
const netease = api.default as unknown as typeof import('@neteasecloudmusicapienhanced/api')

export default defineEventHandler(async (event) => {
  // 设置 CORS 头
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  
  // 处理 OPTIONS 请求
  if (getMethod(event) === 'OPTIONS') {
    return null
  }

  try {
    const body = await readBody(event).catch(() => ({}))
    
    console.log('Download single request body:', body)
    
    if (!body || !body.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameter: id',
        data: { body }
      })
    }

    const response = await netease.song_url_v1({
      id: body.id,
      level: 'exhigh' as api.SoundQualityType,
      cookie: body.cookie ?? getHeader(event, 'cookie') ?? '',
    })
    
    // @ts-expect-error
    const url = response.body?.data?.[0]?.url
    
    if (!url) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Song URL not found'
      })
    }

    return {
      url
    }
  } catch (error: any) {
    // 如果是 H3Error，直接抛出
    if (error.statusCode) {
      throw error
    }
    
    // 其他错误，返回 500
    console.error('Download single error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})

