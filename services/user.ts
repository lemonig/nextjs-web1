import { http } from '@/lib/http/request'
import type { User } from '@/types'
import type {
  EhrEmployee,
  UserListParams,
  UserAddParams,
  UserUpdateParams,
  UpdatePwdParams,
  ProfileSaveParams,
  UserProfile,
} from '@/types/user'

export const userService = {
  getOwner() {
    return http.get<User>('/api/user/owner')
  },

  list(params?: UserListParams) {
    return http.get<User[]>('/api/user/list', params as Record<string, unknown>)
  },

  ehr() {
    return http.get<EhrEmployee[]>('/api/user/ehr')
  },

  add(params: UserAddParams) {
    return http.post<User>('/api/user/add', params)
  },

  update(params: UserUpdateParams) {
    return http.post<User>('/api/user/update', params)
  },

  remove(id: string | number) {
    return http.post<null>('/api/user/delete', { id })
  },

  updatePwd(params: UpdatePwdParams) {
    return http.post<null>('api/user/updatepwd', params)
  },

  profileSave(params: ProfileSaveParams) {
    return http.post<UserProfile>('api/user/profile/save', params)
  },

  getProfile(id: string | number) {
    return http.post<UserProfile>(`api/user/${id}`)
  },
}
