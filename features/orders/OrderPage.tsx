'use client'

import { useState } from 'react'
import { Card, Button, Space, App } from 'antd'
import { PlusOutlined, ExportOutlined } from '@ant-design/icons'
import { quotationService } from '@/services/quotation'
import { showConfirm, showDeleteConfirm } from '@/components/common/ConfirmModal'
import type { Quotation } from '@/types/quotation'
import { useOrderList } from './hooks/useOrderList'
import OrderSearch from './components/OrderSearch'
import OrderTable from './components/OrderTable'
import OrderFormDrawer from './components/OrderFormDrawer'
import OrderDetailPanel from './components/OrderDetailPanel'

export default function OrderPage() {
  const { message } = App.useApp()
  const {
    data,
    loading,
    keyword,
    page,
    pageSize,
    search,
    reset,
    refresh,
    setPage,
  } = useOrderList()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Quotation | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailQuotation, setDetailQuotation] = useState<Quotation | null>(null)
  const [exporting, setExporting] = useState(false)

  // 权限扩展点：报价管理全员可用（对应 09-permission.md）；后端权限接入后替换此处判断
  const canManage = true

  const openCreate = () => {
    setEditing(null)
    setDrawerOpen(true)
  }

  const openEdit = (record: Quotation) => {
    setEditing(record)
    setDrawerOpen(true)
  }

  const openDetail = (record: Quotation) => {
    setDetailQuotation(record)
    setDetailOpen(true)
  }

  const handleDelete = (record: Quotation) => {
    showDeleteConfirm({
      content: `确定删除报价单「${record.project}」吗？`,
      onOk: async () => {
        try {
          await quotationService.remove(record.id)
          message.success('删除成功')
          refresh()
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败')
        }
      },
    })
  }

  const handleCopy = (record: Quotation) => {
    showConfirm({
      title: '复制报价单',
      content: `确定复制报价单「${record.project}」吗？`,
      okText: '复制',
      onOk: async () => {
        try {
          await quotationService.copy(record.id)
          message.success('复制成功')
          refresh()
        } catch (err) {
          message.error(err instanceof Error ? err.message : '复制失败')
        }
      },
    })
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await quotationService.export({ keyword })
    } catch (err) {
      message.error(err instanceof Error ? err.message : '导出失败')
    } finally {
      setExporting(false)
    }
  }

  const handleSuccess = () => {
    setDrawerOpen(false)
    setEditing(null)
    refresh()
  }

  return (
    <Card
      title="报价管理"
      extra={
        <Space>
          {canManage && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              新增报价单
            </Button>
          )}
          <Button
            icon={<ExportOutlined />}
            loading={exporting}
            onClick={handleExport}
          >
            导出
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <OrderSearch loading={loading} onSearch={search} onReset={reset} />
        <OrderTable
          data={data}
          loading={loading}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onEdit={openEdit}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onDetail={openDetail}
          canEdit={canManage}
          canDelete={canManage}
        />
      </Space>
      <OrderFormDrawer
        open={drawerOpen}
        editing={editing}
        onClose={() => setDrawerOpen(false)}
        onSuccess={handleSuccess}
      />
      <OrderDetailPanel
        open={detailOpen}
        quotation={detailQuotation}
        onClose={() => setDetailOpen(false)}
        canManage={canManage}
      />
    </Card>
  )
}
