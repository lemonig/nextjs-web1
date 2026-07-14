'use client'

import { Button, Space, Table } from 'antd'
import type { TablePaginationConfig, TableProps } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import type { Quotation } from '@/types/quotation'

interface OrderTableProps {
  data: Quotation[]
  loading?: boolean
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  onEdit: (record: Quotation) => void
  onDelete: (record: Quotation) => void
  onCopy: (record: Quotation) => void
  onDetail: (record: Quotation) => void
  canEdit?: boolean
  canDelete?: boolean
}

export default function OrderTable({
  data,
  loading,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onCopy,
  onDetail,
  canEdit = true,
  canDelete = true,
}: OrderTableProps) {
  const columns: TableProps<Quotation>['columns'] = [
    { title: '项目', dataIndex: 'project', key: 'project' },
    { title: '单位', dataIndex: 'organization', key: 'organization' },
    {
      title: '有效期',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (v) => v || '-',
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (v) => v || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            icon={<ProfileOutlined />}
            onClick={() => onDetail(record)}
          >
            明细
          </Button>
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
          {canEdit && (
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => onCopy(record)}
            >
              复制
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
    <Table<Quotation>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
    />
  )
}
