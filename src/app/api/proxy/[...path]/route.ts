import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import https from 'https'

const agent = new https.Agent({ rejectUnauthorized: false })
const backendBaseURL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8443'
const backendHost = new URL(backendBaseURL).host
const PROTECTED_PATH_PREFIX = '/v1/'
const AUTH_PATHS = new Set([
  '/v1/auth/email/resend',
  '/v1/auth/email/verify',
  '/v1/auth/login',
  '/v1/auth/refresh',
  '/v1/auth/register',
])

const backend = axios.create({
  baseURL: backendBaseURL,
  httpsAgent: agent,
  validateStatus: () => true,
  maxRedirects: 0,
  timeout: 120_000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
})

const shouldAttachBearerFromRefresh = (path: string) =>
  path.startsWith(PROTECTED_PATH_PREFIX) && !AUTH_PATHS.has(path)

const requestHasAuthorization = (headers: Record<string, string>) =>
  Boolean(headers.authorization || headers.Authorization)

const refreshAccessToken = async (cookieHeader: string) => {
  if (!cookieHeader) {
    return undefined
  }

  const response = await backend.post('/v1/auth/refresh', undefined, {
    headers: {
      cookie: cookieHeader,
      host: backendHost,
    },
  })

  return typeof response.data?.accessToken === 'string' ? response.data.accessToken : undefined
}

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const backendPath = '/v1/' + path.join('/')
  const url = backendPath + req.nextUrl.search

  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => {
    headers[k] = v
  })
  headers.host = backendHost

  const cookieHeader = req.headers.get('cookie') || ''
  if (cookieHeader) {
    headers.cookie = cookieHeader
  }

  if (shouldAttachBearerFromRefresh(backendPath) && !requestHasAuthorization(headers)) {
    try {
      const accessToken = await refreshAccessToken(cookieHeader)
      if (accessToken) {
        headers.authorization = `Bearer ${accessToken}`
      }
    } catch {
      // Continue without a bearer token so the backend remains the source of auth errors.
    }
  }

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(req.method || '')
  let body: string | Buffer | undefined
  if (hasBody) {
    const buffer = await req.arrayBuffer()
    body = buffer.byteLength > 0 ? Buffer.from(buffer) : undefined
  }
  if (headers['content-length']) {
    delete headers['content-length']
  }

  let res
  try {
    res = await backend.request({
      url,
      method: req.method,
      headers,
      data: body,
      responseType: 'arraybuffer',
    })
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { code: 'BACKEND_UNREACHABLE', message: 'Сервер недоступен' },
          { status: 502 }
        )
      }
      if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') {
        return NextResponse.json(
          { code: 'BACKEND_TIMEOUT', message: 'Сервер не отвечает' },
          { status: 504 }
        )
      }
      if (err.response) {
        return new NextResponse(err.response.data as BodyInit | null, {
          status: err.response.status,
          statusText: err.response.statusText,
        })
      }
    }
    return NextResponse.json({ code: 'PROXY_ERROR', message: 'Ошибка прокси' }, { status: 502 })
  }

  const responseHeaders = new Headers()
  Object.entries(res.headers).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase()

    if (lowerKey === 'set-cookie') {
      const cookies = Array.isArray(value) ? value : [value]
      cookies.forEach((cookie) => {
        let rewritten = cookie
          .replace(/Path=\/v1\b/gi, 'Path=/api/proxy')
          .replace(/Path=\/v1\//gi, 'Path=/api/proxy/')
        rewritten = rewritten.replace(/Domain=[^;]+;?/gi, '')
        if (process.env.NODE_ENV === 'development') {
          rewritten = rewritten.replace(/Secure;?/gi, '')
        }
        responseHeaders.append(key, rewritten)
      })
      return
    }

    if (typeof value === 'string') {
      responseHeaders.set(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((v) => responseHeaders.append(key, v))
    }
  })

  return new NextResponse(res.data, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy
export const PATCH = proxy
export const OPTIONS = proxy
export const HEAD = proxy
