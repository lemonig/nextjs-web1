'use client'

import { useEffect, useRef } from 'react'
import { authService } from '@/services/auth'
import { getToken } from '@/lib/auth/token'
import { MOCK_MENU_LIST } from '@/lib/auth/menu'
import { setToken } from '@/store/slices/authSlice'
import { setUser } from '@/store/slices/userSlice'
import { setRole, setMenuList } from '@/store/slices/permissionSlice'
import { useAppDispatch } from '@/store/hooks'

export default function AuthBootstrap({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const token = getToken()
    if (!token) return

    dispatch(setToken(token))

    // Phase 3：先注入 mock 菜单，后续替换为后端 menuList
    dispatch(setMenuList(MOCK_MENU_LIST))

    authService
      .getCurrentUser()
      .then((user) => {
        dispatch(setUser(user))
        dispatch(setRole(user.role ?? null))
      })
      .catch(() => {
        // 忽略：token 失效时由 axios 拦截器统一处理跳转
      })
  }, [dispatch])

  return <>{children}</>
}
