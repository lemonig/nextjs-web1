export type LoginStatus =
  | 'idle'
  | 'authenticating'
  | 'authenticated'
  | 'failed'

export interface SsoAuthUrlResponse {
  isLogin: boolean
  serverAuthUrl: string
}

export interface DoLoginByTicketResponse {
  access_token: string
}

export interface SsoAuthUrlParams {
  clientLoginUrl: string
}

export interface DoLoginByTicketParams {
  ticket: string
}
