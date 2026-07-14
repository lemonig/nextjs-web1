import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getToken, clearToken } from '@/lib/auth/token'
import type { ApiResponse } from './types'

const baseURL = process.env.NEXT_PUBLIC_API_BASE ?? '/api'

const NO_AUTH_URLS = [
  'api/sso/getSsoAuthUrl',
  'api/sso/doLoginByTicket',
]

function isNoAuthUrl(url = ''): boolean {
  return (
    NO_AUTH_URLS.some((u) => url.includes(u)) || url.includes('assets/')
  )
}

export const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!isNoAuthUrl(config.url)) {
      const token = getToken()
      if (token) {
        config.headers.set('token', token)
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    if (res.code === 401) {
      clearToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(new Error(res.message || '未授权'))
    }

    if (res.code === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403'
      }
      return Promise.reject(new Error(res.message || '无权限'))
    }

    return response
  },
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? '网络错误'
    return Promise.reject(new Error(message))
  },
)

export default instance
