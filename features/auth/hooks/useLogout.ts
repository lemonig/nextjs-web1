'use client'

import { useCallback } from 'react'
import { authService } from '@/services/auth'
import { clearToken } from '@/lib/auth/token'
import { clearAuth } from '@/store/slices/authSlice'
import { clearUser } from '@/store/slices/userSlice'
import { useAppDispatch } from '@/store/hooks'

export function useLogout() {
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearToken()
      dispatch(clearAuth())
      dispatch(clearUser())
      if (typeof window !== 'undefined') {
        window.location.href = window.location.origin
      }
    }
  }, [dispatch])
}
