'use client'

import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

export interface ConfirmOptions {
  title?: ReactNode
  content?: ReactNode
  okText?: string
  cancelText?: string
  onOk?: () => void | Promise<void>
  onCancel?: () => void
}

export function showConfirm({
  title = '确认操作',
  content = '确定要执行此操作吗？',
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
}: ConfirmOptions): void {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    onOk,
    onCancel,
  })
}

export function showDeleteConfirm(options: ConfirmOptions = {}): void {
  showConfirm({
    title: '确认删除',
    content: '删除后不可恢复，确定删除吗？',
    okText: '删除',
    ...options,
  })
}
