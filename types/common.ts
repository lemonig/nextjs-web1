import type { Key, ReactNode } from 'react'

export interface TreeNode<T = unknown> {
  key: Key
  title: ReactNode
  children?: TreeNode<T>[]
  disabled?: boolean
  isLeaf?: boolean
  data?: T
}

export interface FlatTreeItem {
  id: Key
  parentId: Key | null
  [prop: string]: unknown
}

export interface UploadResult<T = unknown> {
  name: string
  url?: string
  status: 'done' | 'error'
  response?: T
}

export interface PaginationState {
  current: number
  pageSize: number
  total: number
}
