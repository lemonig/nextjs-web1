export interface PageQuery {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page?: number
  pageSize?: number
}

export interface IdParams {
  id: string | number
}
