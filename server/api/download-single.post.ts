const API_BASE_URL = 'https://server.xhhzs.cn'

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
    
    if (!body || !body.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameter: id',
        data: { body }
      })
    }

    // 构建查询参数
    const params = new URLSearchParams({
      id: String(body.id),
      level: 'exhigh', // 高品质
    })

    // 请求网易云 API 服务
    const apiUrl = `${API_BASE_URL}/song/url/v1?${params.toString()}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // 如果有 cookie，添加到请求头
    const cookie = body.cookie ?? getHeader(event, 'cookie') ?? ''
    if (cookie) {
      headers['Cookie'] = cookie
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `API request failed: ${response.statusText}`
      })
    }

    const data = await response.json()
    
    // 解析响应数据
    const url = data?.data?.[0]?.url || data?.url
    
    if (!url) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Song URL not found',
        data: { response: data }
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

