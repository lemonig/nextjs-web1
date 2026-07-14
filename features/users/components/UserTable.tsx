'use client'

import { Button, Space, Table, Tag } from 'antd'
import type { TablePaginationConfig, TableProps } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { User } from '@/types'
import { ROLE_TEXT } from '@/types/user'

interface UserTableProps {
  data: User[]
  loading?: boolean
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  onEdit: (record: User) => void
  onDelete: (record: User) => void
  canEdit?: boolean
  canDelete?: boolean
}

export default function UserTable({
  data,
  loading,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: UserTableProps) {
  const columns: TableProps<User>['columns'] = [
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '账号', dataIndex: 'account', key: 'account' },
    { title: '手机号', dataIndex: 'mobile', key: 'mobile', render: (v) => v || '-' },
    { title: '公司', dataIndex: 'company', key: 'company', render: (v) => v || '-' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: number) => (
        <Tag color="blue">{ROLE_TEXT[role] ?? `role:${role}`}</Tag>
      ),
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
    <Table<User>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
    />
  )
}
