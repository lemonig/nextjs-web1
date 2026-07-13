import instance from './axios'
import type { ApiResponse } from './types'

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  payload?: unknown,
): Promise<T> {
  const response = await instance.request<ApiResponse<T>>({
    method,
    url,
    ...(method === 'GET'
      ? { params: payload }
      : { data: payload }),
  })
  return response.data.data
}

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>('GET', url, params),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
  put: <T>(url: string, body?: unknown) => request<T>('PUT', url, body),
  delete: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>('DELETE', url, params),
}

export type { ApiResponse }
