export interface ApiResponse<T = unknown> {
  success: boolean
  code: number
  data: T
  message: string
}
