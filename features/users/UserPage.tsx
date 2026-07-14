'use client'

import { useState } from 'react'
import { Card, Button, Space, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/store/hooks'
import { userService } from '@/services/user'
import { showDeleteConfirm } from '@/components/common/ConfirmModal'
import type { User } from '@/types'
import { useUserList } from './hooks/useUserList'
import UserSearch from './components/UserSearch'
import UserTable from './components/UserTable'
import UserFormModal from './components/UserFormModal'

export default function UserPage() {
  const { message } = App.useApp()
  const role = useAppSelector((s) => s.user.role)
  const {
    data,
    loading,
    page,
    pageSize,
    search,
    reset,
    refresh,
    setPage,
  } = useUserList()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  // 权限扩展点：用户管理仅超级管理员(role=4)可增删改；后端权限接入后替换此处判断
  const canManage = role === 4 || role == null

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (record: User) => {
    setEditing(record)
    setModalOpen(true)
  }

  const handleDelete = (record: User) => {
    showDeleteConfirm({
      content: `确定删除用户「${record.nickname}」吗？`,
      onOk: async () => {
        try {
          await userService.remove(record.id)
          message.success('删除成功')
          refresh()
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败')
        }
      },
    })
  }

  const handleSuccess = () => {
    setModalOpen(false)
    setEditing(null)
    refresh()
  }

  return (
    <Card
      title="用户管理"
      extra={
        canManage && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增用户
          </Button>
        )
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <UserSearch loading={loading} onSearch={search} onReset={reset} />
        <UserTable
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
      <UserFormModal
        open={modalOpen}
        editing={editing}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </Card>
  )
}
