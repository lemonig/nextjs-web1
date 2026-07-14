'use client'

import { useState } from 'react'
import { Drawer, Button, Space, Table, App } from 'antd'
import type { TableProps } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { quotationDetailService } from '@/services/quotationDetail'
import { showDeleteConfirm } from '@/components/common/ConfirmModal'
import type { Quotation, QuotationDetail } from '@/types/quotation'
import { useOrderDetail } from '../hooks/useOrderDetail'
import OrderDetailFormModal from './OrderDetailFormModal'

interface OrderDetailPanelProps {
  open: boolean
  quotation: Quotation | null
  onClose: () => void
  canManage?: boolean
}

export default function OrderDetailPanel({
  open,
  quotation,
  onClose,
  canManage = true,
}: OrderDetailPanelProps) {
  const { message } = App.useApp()
  const quotationId = quotation?.id ?? null
  const { data, loading, refresh } = useOrderDetail(open ? quotationId : null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<QuotationDetail | null>(null)
  const [priceUpdating, setPriceUpdating] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (record: QuotationDetail) => {
    setEditing(record)
    setModalOpen(true)
  }

  const handleDelete = (record: QuotationDetail) => {
    showDeleteConfirm({
      content: '确定删除该明细行吗？',
      onOk: async () => {
        try {
          await quotationDetailService.remove(record.id)
          message.success('删除成功')
          refresh()
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败')
        }
      },
    })
  }

  const handleBatchUpdatePrice = async () => {
    if (quotationId == null) return
    setPriceUpdating(true)
    try {
      await quotationDetailService.batchUpdatePrice({ quotationId })
      message.success('价格已更新')
      refresh()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '更新价格失败')
    } finally {
      setPriceUpdating(false)
    }
  }

  const handleSuccess = () => {
    setModalOpen(false)
    setEditing(null)
    refresh()
  }

  const columns: TableProps<QuotationDetail>['columns'] = [
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      render: (v, record) => v || record.productId || '-',
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      render: (v) => (v != null ? v : '-'),
    },
    {
      title: '小区/位置',
      dataIndex: 'community',
      key: 'community',
      render: (v) => v || '-',
    },
    {
      title: '序列号',
      dataIndex: 'serial',
      key: 'serial',
      render: (v) => v || '-',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (v) => v || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_, record) =>
        canManage ? (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Space>
        ) : (
          '-'
        ),
    },
  ]

  return (
    <Drawer
      title={
        quotation ? `报价明细 - ${quotation.project}` : '报价明细'
      }
      open={open}
      onClose={onClose}
      width={860}
      destroyOnClose
      extra={
        canManage && (
          <Space>
            <Button
              icon={<SyncOutlined />}
              loading={priceUpdating}
              onClick={handleBatchUpdatePrice}
            >
              更新价格
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreate}
            >
              新增明细
            </Button>
          </Space>
        )
      }
    >
      <Table<QuotationDetail>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ showTotal: (t) => `共 ${t} 条` }}
      />
      {quotationId != null && (
        <OrderDetailFormModal
          open={modalOpen}
          quotationId={quotationId}
          editing={editing}
          onCancel={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </Drawer>
  )
}
