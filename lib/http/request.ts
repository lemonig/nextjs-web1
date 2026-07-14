import instance from './axios'
import { downloadExcel } from '@/lib/excel/download'
import type { ApiResponse } from './types'

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  payload?: unknown,
): Promise<T> {
  const response = await instance.request<ApiResponse<T>>({
    method,
    url,
    ...(method === 'GET' ? { params: payload } : { data: payload }),
  })
  const res = response.data
  if (!res.success) {
    return Promise.reject(new Error(res.message || '请求失败'))
  }
  return res.data
}

async function requestRaw<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  payload?: unknown,
): Promise<ApiResponse<T>> {
  const response = await instance.request<ApiResponse<T>>({
    method,
    url,
    ...(method === 'GET' ? { params: payload } : { data: payload }),
  })
  return response.data
}

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>('GET', url, params),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
  put: <T>(url: string, body?: unknown) => request<T>('PUT', url, body),
  delete: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>('DELETE', url, params),
  getRaw: <T>(url: string, params?: Record<string, unknown>) =>
    requestRaw<T>('GET', url, params),
  postRaw: <T>(url: string, body?: unknown) =>
    requestRaw<T>('POST', url, body),
  download: (url: string, body: unknown, filename: string, ext?: string) =>
    downloadExcel(url, body, filename, ext),
}

export type { ApiResponse }
