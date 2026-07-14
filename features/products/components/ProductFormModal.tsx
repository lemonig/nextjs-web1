'use client'

import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, App } from 'antd'
import { productService } from '@/services/product'
import type { Product, ProductCategory } from '@/types/product'

interface ProductFormModalProps {
  open: boolean
  editing: Product | null
  category: ProductCategory | undefined
  onCancel: () => void
  onSuccess: () => void
}

type FormValues = Record<string, unknown>

export default function ProductFormModal({
  open,
  editing,
  category,
  onCancel,
  onSuccess,
}: ProductFormModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<FormValues>()
  const [submitting, setSubmitting] = useState(false)

  const isEdit = !!editing
  const dynamicFields = category?.categoryFieldList ?? []
  const brandList = category?.brandList ?? []

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.setFieldsValue({ ...editing })
    } else {
      form.resetFields()
    }
  }, [open, editing, form])

  const handleOk = async () => {
    if (!category) {
      message.warning('请先在左侧选择产品分类')
      return
    }
    const values = await form.validateFields()
    setSubmitting(true)
    try {
      if (isEdit && editing) {
        await productService.update({
          id: editing.id,
          categoryId: category.id,
          name: String(values.name ?? ''),
          ...values,
        })
        message.success('更新成功')
      } else {
        await productService.insert({
          categoryId: category.id,
          name: String(values.name ?? ''),
          ...values,
        })
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
      title={isEdit ? '编辑产品' : '新增产品'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item label="所属分类">
          <Input value={category?.name ?? '-'} disabled />
        </Form.Item>
        <Form.Item
          name="name"
          label="产品名称"
          rules={[{ required: true, message: '请输入产品名称' }]}
        >
          <Input placeholder="请输入产品名称" />
        </Form.Item>
        <Form.Item name="brand" label="品牌">
          {brandList.length > 0 ? (
            <Select
              allowClear
              placeholder="请选择品牌"
              options={brandList.map((b) => ({ label: b, value: b }))}
            />
          ) : (
            <Input placeholder="请输入品牌" />
          )}
        </Form.Item>
        <Form.Item name="price" label="价格">
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="请输入价格"
          />
        </Form.Item>
        {dynamicFields.map((f) => (
          <Form.Item key={f.field} name={f.field} label={f.name}>
            <Input placeholder={`请输入${f.name}`} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  )
}
