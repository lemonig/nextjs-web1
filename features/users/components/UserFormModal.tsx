'use client'

import { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, App } from 'antd'
import { userService } from '@/services/user'
import type { User } from '@/types'
import type { EhrEmployee, UserFormValues } from '@/types/user'
import { USER_ROLES } from '@/types/user'

interface UserFormModalProps {
  open: boolean
  editing: User | null
  onCancel: () => void
  onSuccess: () => void
}

export default function UserFormModal({
  open,
  editing,
  onCancel,
  onSuccess,
}: UserFormModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<UserFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const [ehrLoading, setEhrLoading] = useState(false)
  const [ehrList, setEhrList] = useState<EhrEmployee[]>([])

  const isEdit = !!editing

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.setFieldsValue({
        openId: editing.openId,
        nickname: editing.nickname,
        account: editing.account,
        mobile: editing.mobile,
        company: editing.company,
        role: editing.role,
      })
      return
    }
    form.resetFields()
    let active = true
    const loadEhr = async () => {
      setEhrLoading(true)
      try {
        const list = await userService.ehr()
        if (active) setEhrList(list ?? [])
      } catch (err) {
        if (active) {
          message.error(err instanceof Error ? err.message : '加载员工失败')
        }
      } finally {
        if (active) setEhrLoading(false)
      }
    }
    loadEhr()
    return () => {
      active = false
    }
  }, [open, editing, form, message])

  const onSelectEhr = (id: string) => {
    const emp = ehrList.find((e) => e.id === id)
    if (emp) {
      form.setFieldsValue({
        openId: emp.id,
        nickname: emp.name,
        account: emp.account ?? '',
        mobile: emp.mobile,
      })
    }
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    setSubmitting(true)
    try {
      if (isEdit && editing) {
        await userService.update({ id: editing.id, ...values })
        message.success('更新成功')
      } else {
        await userService.add(values)
        message.success('新增成功')
      }
      onSuccess()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={isEdit ? '编辑用户' : '新增用户'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical" preserve={false}>
        {!isEdit && (
          <Form.Item label="选择员工（EHR）">
            <Select
              showSearch
              loading={ehrLoading}
              placeholder="从 EHR 选择员工自动填充"
              optionFilterProp="label"
              onChange={onSelectEhr}
              options={ehrList.map((e) => ({
                label: `${e.name}${e.department ? ` (${e.department})` : ''}`,
                value: e.id,
              }))}
            />
          </Form.Item>
        )}
        <Form.Item name="openId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input disabled={isEdit} placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          name="account"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        >
          <Input disabled={isEdit} placeholder="请输入账号" />
        </Form.Item>
        <Form.Item name="mobile" label="手机号">
          <Input disabled={isEdit} placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="company" label="公司">
          <Input disabled={isEdit} placeholder="请输入公司" />
        </Form.Item>
        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色" options={USER_ROLES} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
