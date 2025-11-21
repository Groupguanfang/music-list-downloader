export default defineEventHandler(async (event) => {
  // 设置 CORS 头
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  
  // 处理 OPTIONS 请求
  if (getMethod(event) === 'OPTIONS') {
    return null
  }

  try {
    const query = getQuery(event)
    const audioUrl = query.url as string
    
    if (!audioUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameter: url'
      })
    }

    // 从网易云 CDN 下载音频文件
    const response = await fetch(audioUrl)
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch audio: ${response.statusText}`
      })
    }

    // 获取音频数据
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 设置响应头
    setHeader(event, 'Content-Type', 'audio/mpeg')
    setHeader(event, 'Content-Disposition', 'inline')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000')

    return buffer
  } catch (error: any) {
    // 如果是 H3Error，直接抛出
    if (error.statusCode) {
      throw error
    }
    
    // 其他错误，返回 500
    console.error('Proxy audio error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})

