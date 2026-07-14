'use client'

import { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import { productService } from '@/services/product'
import type { Product } from '@/types/product'

interface UseProductListState {
  data: Product[]
  loading: boolean
  keyword: string
  categoryId: string | number | null
  page: number
  pageSize: number
}

const INITIAL: UseProductListState = {
  data: [],
  loading: true,
  keyword: '',
  categoryId: null,
  page: 1,
  pageSize: 10,
}

export function useProductList() {
  const { message } = App.useApp()
  const [state, setState] = useState<UseProductListState>(INITIAL)

  const fetchList = useCallback(
    async (categoryId: string | number | null, keyword: string) => {
      setState((s) => ({ ...s, loading: true }))
      try {
        const list = await productService.list({
          categoryId: categoryId ?? undefined,
          keyword,
        })
        setState((s) => ({ ...s, data: list ?? [], loading: false }))
      } catch (err) {
        setState((s) => ({ ...s, loading: false }))
        message.error(err instanceof Error ? err.message : '加载产品列表失败')
      }
    },
    [message],
  )

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const list = await productService.list({ keyword: '' })
        if (active) {
          setState((s) => ({ ...s, data: list ?? [], loading: false }))
        }
      } catch (err) {
        if (active) {
          setState((s) => ({ ...s, loading: false }))
          message.error(err instanceof Error ? err.message : '加载产品列表失败')
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [message])

  const selectCategory = useCallback(
    (categoryId: string | number | null) => {
      setState((s) => ({ ...s, categoryId, page: 1 }))
      fetchList(categoryId, state.keyword)
    },
    [fetchList, state.keyword],
  )

  const search = useCallback(
    (keyword: string) => {
      setState((s) => ({ ...s, keyword, page: 1 }))
      fetchList(state.categoryId, keyword)
    },
    [fetchList, state.categoryId],
  )

  const reset = useCallback(() => {
    setState((s) => ({ ...s, keyword: '', page: 1 }))
    fetchList(state.categoryId, '')
  }, [fetchList, state.categoryId])

  const refresh = useCallback(() => {
    fetchList(state.categoryId, state.keyword)
  }, [fetchList, state.categoryId, state.keyword])

  const setPage = useCallback((page: number, pageSize: number) => {
    setState((s) => ({ ...s, page, pageSize }))
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    keyword: state.keyword,
    categoryId: state.categoryId,
    page: state.page,
    pageSize: state.pageSize,
    selectCategory,
    search,
    reset,
    refresh,
    setPage,
  }
}
