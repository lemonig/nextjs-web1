'use client'

import { useState } from 'react'
import { Card, Button, Space, App, Row, Col } from 'antd'
import {
  PlusOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import type { TreeDataNode } from 'antd'
import { useAppSelector } from '@/store/hooks'
import { productService } from '@/services/product'
import DeviceTree from '@/components/common/DeviceTree'
import UploadButton from '@/components/common/UploadButton'
import { showDeleteConfirm } from '@/components/common/ConfirmModal'
import type { Product } from '@/types/product'
import { useProductCategory } from './hooks/useProductCategory'
import { useProductList } from './hooks/useProductList'
import ProductSearch from './components/ProductSearch'
import ProductTable from './components/ProductTable'
import ProductFormModal from './components/ProductFormModal'

const IMPORT_ACTION = `${process.env.NEXT_PUBLIC_API_BASE ?? '/api'}/product/import`

export default function ProductPage() {
  const { message } = App.useApp()
  const role = useAppSelector((s) => s.user.role)
  const { treeData, loading: categoryLoading, findCategory } =
    useProductCategory()
  const {
    data,
    loading,
    categoryId,
    page,
    pageSize,
    selectCategory,
    search,
    reset,
    refresh,
    setPage,
  } = useProductList()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [exporting, setExporting] = useState(false)

  // 权限扩展点：产品管理 role 1/4 可见；后端权限接入后替换
  const canManage = role === 1 || role === 4 || role == null

  const currentCategory = findCategory(categoryId)

  const onTreeSelect = (node: TreeDataNode | null) => {
    selectCategory(node ? (node.key as string | number) : null)
  }

  const openCreate = () => {
    if (!currentCategory) {
      message.warning('请先在左侧选择产品分类')
      return
    }
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (record: Product) => {
    setEditing(record)
    setModalOpen(true)
  }

  const handleDelete = (record: Product) => {
    showDeleteConfirm({
      content: `确定删除产品「${record.name}」吗？`,
      onOk: async () => {
        try {
          await productService.remove(record.id)
          message.success('删除成功')
          refresh()
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败')
        }
      },
    })
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await productService.export({
        categoryId: categoryId ?? undefined,
      })
    } catch (err) {
      message.error(err instanceof Error ? err.message : '导出失败')
    } finally {
      setExporting(false)
    }
  }

  const handleSuccess = () => {
    setModalOpen(false)
    setEditing(null)
    refresh()
  }

  return (
    <Row gutter={16}>
      <Col xs={24} sm={8} md={6} lg={5}>
        <Card title="产品分类" styles={{ body: { padding: 12 } }}>
          <DeviceTree
            treeData={treeData}
            loading={categoryLoading}
            onSelect={onTreeSelect}
          />
        </Card>
      </Col>
      <Col xs={24} sm={16} md={18} lg={19}>
        <Card
          title="产品管理"
          extra={
            canManage && (
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCreate}
                >
                  新增产品
                </Button>
                <UploadButton
                  action={IMPORT_ACTION}
                  accept=".xls,.xlsx"
                  showUploadList={false}
                  buttonText="导入"
                  data={{ categoryId: categoryId ?? '' }}
                  onDone={() => {
                    message.success('导入成功')
                    refresh()
                  }}
                  onError={(err) => message.error(err.message)}
                />
                <Button
                  icon={<ExportOutlined />}
                  loading={exporting}
                  onClick={handleExport}
                >
                  导出
                </Button>
              </Space>
            )
          }
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <ProductSearch loading={loading} onSearch={search} onReset={reset} />
            <ProductTable
              data={data}
              loading={loading}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onEdit={openEdit}
              onDelete={handleDelete}
              canEdit={canManage}
              canDelete={canManage}
            />
          </Space>
        </Card>
      </Col>
      <ProductFormModal
        open={modalOpen}
        editing={editing}
        category={currentCategory}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </Row>
  )
}
