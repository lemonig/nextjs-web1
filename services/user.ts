import { http } from '@/lib/http/request'
import type { User } from '@/types'

export const userService = {
  list: () => http.get<User[]>('/api/user/list'),
}
