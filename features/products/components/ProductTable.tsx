'use client'

import { Button, Space, Table } from 'antd'
import type { TablePaginationConfig, TableProps } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Product } from '@/types/product'

interface ProductTableProps {
  data: Product[]
  loading?: boolean
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  onEdit: (record: Product) => void
  onDelete: (record: Product) => void
  canEdit?: boolean
  canDelete?: boolean
}

export default function ProductTable({
  data,
  loading,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: ProductTableProps) {
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
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          {canEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
          )}
          {canDelete && (
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total: data.length,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onPageChange,
  }

  return (
    <Table<Product>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
    />
  )
}
