import type { User } from './index'

export interface EhrEmployee {
  id: string
  name: string
  account?: string
  department?: string
  mobile?: string
}

export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface UserAddParams {
  openId?: string
  nickname: string
  account: string
  mobile?: string
  company?: string
  role: number
}

export interface UserUpdateParams {
  id: string | number
  role: number
  [prop: string]: unknown
}

export interface UpdatePwdParams {
  oldPwd: string
  newPwd: string
}

export interface ProfileSaveParams {
  nickname?: string
  mobile?: string
  company?: string
  avatar?: string
  wechat_url?: string
  [prop: string]: unknown
}

export type UserProfile = User

export const USER_ROLES: { label: string; value: number }[] = [
  { label: '管理员/产品管理者', value: 1 },
  { label: '普通用户', value: 2 },
  { label: '普通用户', value: 3 },
  { label: '超级管理员', value: 4 },
]

export const ROLE_TEXT: Record<number, string> = {
  1: '管理员',
  2: '普通用户',
  3: '普通用户',
  4: '超级管理员',
}

export interface UserFormValues {
  openId?: string
  nickname: string
  account: string
  mobile?: string
  company?: string
  role: number
}
