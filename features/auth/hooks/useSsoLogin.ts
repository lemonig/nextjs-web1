'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/auth'
import { setToken, setLoginStatus } from '@/store/slices/authSlice'
import { setUser } from '@/store/slices/userSlice'
import { setToken as saveToken } from '@/lib/auth/token'
import { useAppDispatch } from '@/store/hooks'

const HOME_PATH = '/dashboard'

export function useSsoLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const ticket = searchParams.get('ticket')
    const redirect = searchParams.get('redirect') || HOME_PATH

    async function run() {
      try {
        dispatch(setLoginStatus('authenticating'))

        if (ticket) {
          const accessToken = await authService.doLoginByTicket(ticket)
          saveToken(accessToken)
          dispatch(setToken(accessToken))

          const user = await authService.getCurrentUser()
          dispatch(setUser(user))

          router.replace(redirect)
          return
        }

        const { isLogin, serverAuthUrl } = await authService.getSsoLoginUrl(
          window.location.origin,
        )
        if (isLogin) {
          window.location.reload()
        } else {
          window.location.href = serverAuthUrl
        }
      } catch (err) {
        dispatch(setLoginStatus('failed'))
        setError(err instanceof Error ? err.message : '登录失败')
      }
    }

    run()
  }, [dispatch, router, searchParams])

  return { error }
}
