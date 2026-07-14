export * from './common'
export * from './api'
export * from './user'
export * from './quotation'
export * from './product'
export * from './common-api'

export interface User {
  id: string
  openId?: string
  nickname: string
  account: string
  mobile?: string
  company?: string
  avatar?: string
  wechat_url?: string
  role: number
  is_admin?: number
  is_assistant?: number
  deal_notify?: number
  status?: number
}
