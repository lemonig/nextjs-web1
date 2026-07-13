import type { ApiResponse } from './types'

async function request<T>(
  method: 'GET' | 'POST',
  url: string,
  payload?: unknown,
): Promise<T> {
  void method
  void url
  void payload
  throw new Error('request() not implemented')
}

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>('GET', url, params),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
}

export type { ApiResponse }
