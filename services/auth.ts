import { http } from '@/lib/http/request'
import type { User } from '@/types'
import type {
  SsoAuthUrlResponse,
  DoLoginByTicketResponse,
} from '@/types/auth'

export const authService = {
  getSsoLoginUrl(clientLoginUrl: string) {
    return http.post<SsoAuthUrlResponse>('api/sso/getSsoAuthUrl', {
      clientLoginUrl,
    })
  },

  async doLoginByTicket(ticket: string): Promise<string> {
    const res = await http.postRaw<DoLoginByTicketResponse>(
      'api/sso/doLoginByTicket',
      { ticket },
    )
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || '登录失败'))
    }
    return res.data.access_token
  },

  getCurrentUser() {
    return http.get<User>('/api/user/owner')
  },

  logout() {
    return http.post<null>('api/sso/logout')
  },
}
