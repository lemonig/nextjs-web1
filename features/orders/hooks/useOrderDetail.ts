'use client'

import { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import { quotationDetailService } from '@/services/quotationDetail'
import type { QuotationDetail } from '@/types/quotation'

export function useOrderDetail(quotationId: string | number | null) {
  const { message } = App.useApp()
  const [data, setData] = useState<QuotationDetail[]>([])
  const [loading, setLoading] = useState(false)

  const fetchList = useCallback(
    async (id: string | number) => {
      setLoading(true)
      try {
        const list = await quotationDetailService.list({ quotationId: id })
        setData(list ?? [])
      } catch (err) {
        message.error(err instanceof Error ? err.message : '加载报价明细失败')
      } finally {
        setLoading(false)
      }
    },
    [message],
  )

  useEffect(() => {
    let active = true
    const load = async () => {
      if (quotationId == null) {
        if (active) setData([])
        return
      }
      setLoading(true)
      try {
        const list = await quotationDetailService.list({ quotationId })
        if (active) setData(list ?? [])
      } catch (err) {
        if (active) {
          message.error(err instanceof Error ? err.message : '加载报价明细失败')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [quotationId, message])

  const refresh = useCallback(() => {
    if (quotationId != null) fetchList(quotationId)
  }, [fetchList, quotationId])

  return { data, loading, refresh }
}
