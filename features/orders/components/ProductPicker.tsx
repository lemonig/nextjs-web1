'use client'

import { useEffect, useState } from 'react'
import { Modal, Input, Table, App } from 'antd'
import type { TableProps } from 'antd'
import { productService } from '@/services/product'
import type { Product } from '@/types/product'

interface ProductPickerProps {
  open: boolean
  onCancel: () => void
  onSelect: (product: Product) => void
}

export default function ProductPicker({
  open,
  onCancel,
  onSelect,
}: ProductPickerProps) {
  const { message } = App.useApp()
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')

  const fetchList = async (kw: string) => {
    setLoading(true)
    try {
      const list = await productService.list({ keyword: kw })
      setData(list ?? [])
    } catch (err) {
      message.error(err instanceof Error ? err.message : '加载产品列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const list = await productService.list({ keyword: '' })
        if (active) {
          setKeyword('')
          setData(list ?? [])
        }
      } catch (err) {
        if (active) {
          message.error(err instanceof Error ? err.message : '加载产品列表失败')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const columns: TableProps<Product>['columns'] = [
    { title: '产品名称', dataIndex: 'name', key: 'name' },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      render: (v) => v || '-',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (v: number | undefined) => (v != null ? v : '-'),
    },
  ]

  return (
    <Modal
      title="选择产品"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Input.Search
        allowClear
        placeholder="产品名称 / 品牌"
        style={{ marginBottom: 12 }}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={(v) => fetchList(v.trim())}
      />
      <Table<Product>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        size="small"
        pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条` }}
        onRow={(record) => ({
          onClick: () => onSelect(record),
          style: { cursor: 'pointer' },
        })}
      />
    </Modal>
  )
}
