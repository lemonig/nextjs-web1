'use client'

import { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import { userService } from '@/services/user'
import type { User } from '@/types'

interface UseUserListState {
  data: User[]
  loading: boolean
  keyword: string
  page: number
  pageSize: number
}

const INITIAL: UseUserListState = {
  data: [],
  loading: true,
  keyword: '',
  page: 1,
  pageSize: 10,
}

export function useUserList() {
  const { message } = App.useApp()
  const [state, setState] = useState<UseUserListState>(INITIAL)

  const fetchList = useCallback(
    async (keyword: string) => {
      setState((s) => ({ ...s, loading: true }))
      try {
        const list = await userService.list({ keyword })
        setState((s) => ({ ...s, data: list ?? [], loading: false }))
      } catch (err) {
        setState((s) => ({ ...s, loading: false }))
        message.error(err instanceof Error ? err.message : '加载用户列表失败')
      }
    },
    [message],
  )

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const list = await userService.list({ keyword: '' })
        if (active) {
          setState((s) => ({ ...s, data: list ?? [], loading: false }))
        }
      } catch (err) {
        if (active) {
          setState((s) => ({ ...s, loading: false }))
          message.error(err instanceof Error ? err.message : '加载用户列表失败')
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [message])

  const search = useCallback(
    (keyword: string) => {
      setState((s) => ({ ...s, keyword, page: 1 }))
      fetchList(keyword)
    },
    [fetchList],
  )

  const reset = useCallback(() => {
    setState((s) => ({ ...s, keyword: '', page: 1 }))
    fetchList('')
  }, [fetchList])

  const refresh = useCallback(() => {
    fetchList(state.keyword)
  }, [fetchList, state.keyword])

  const setPage = useCallback((page: number, pageSize: number) => {
    setState((s) => ({ ...s, page, pageSize }))
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    keyword: state.keyword,
    page: state.page,
    pageSize: state.pageSize,
    search,
    reset,
    refresh,
    setPage,
  }
}
