'use client'

import { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import { quotationService } from '@/services/quotation'
import type { Quotation } from '@/types/quotation'

interface UseOrderListState {
  data: Quotation[]
  loading: boolean
  keyword: string
  page: number
  pageSize: number
}

const INITIAL: UseOrderListState = {
  data: [],
  loading: true,
  keyword: '',
  page: 1,
  pageSize: 10,
}

export function useOrderList() {
  const { message } = App.useApp()
  const [state, setState] = useState<UseOrderListState>(INITIAL)

  const fetchList = useCallback(
    async (keyword: string) => {
      setState((s) => ({ ...s, loading: true }))
      try {
        const list = await quotationService.list({ keyword })
        setState((s) => ({ ...s, data: list ?? [], loading: false }))
      } catch (err) {
        setState((s) => ({ ...s, loading: false }))
        message.error(err instanceof Error ? err.message : '加载报价单列表失败')
      }
    },
    [message],
  )

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const list = await quotationService.list({ keyword: '' })
        if (active) {
          setState((s) => ({ ...s, data: list ?? [], loading: false }))
        }
      } catch (err) {
        if (active) {
          setState((s) => ({ ...s, loading: false }))
          message.error(
            err instanceof Error ? err.message : '加载报价单列表失败',
          )
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
