'use client'

import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Button, Space, App } from 'antd'
import { quotationDetailService } from '@/services/quotationDetail'
import type {
  QuotationDetail,
  QuotationDetailFormValues,
} from '@/types/quotation'
import type { Product } from '@/types/product'
import ProductPicker from './ProductPicker'

interface OrderDetailFormModalProps {
  open: boolean
  quotationId: string | number
  editing: QuotationDetail | null
  onCancel: () => void
  onSuccess: () => void
}

export default function OrderDetailFormModal({
  open,
  quotationId,
  editing,
  onCancel,
  onSuccess,
}: OrderDetailFormModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<QuotationDetailFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const productName = (Form.useWatch('productName', form) as string) ?? ''

  const isEdit = !!editing

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.setFieldsValue({
        productId: editing.productId,
        productName:
          typeof editing.productName === 'string' ? editing.productName : '',
        number: editing.number,
        community: editing.community,
        remarks: editing.remarks,
        serial: editing.serial,
        verificationCode: editing.verificationCode,
      })
    } else {
      form.resetFields()
    }
  }, [open, editing, form])

  const onPickProduct = (product: Product) => {
    form.setFieldsValue({ productId: product.id, productName: product.name })
    setPickerOpen(false)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    setSubmitting(true)
    try {
      if (isEdit && editing) {
        await quotationDetailService.update({
          id: editing.id,
          quotationId,
          ...values,
        })
        message.success('更新成功')
      } else {
        await quotationDetailService.insert({ quotationId, ...values })
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
      title={isEdit ? '编辑明细' : '新增明细'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="productId"
          hidden
          rules={[{ required: true, message: '请选择产品' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="productName" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="产品" required>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              style={{ width: 'calc(100% - 96px)' }}
              value={productName}
              placeholder="请选择产品"
              readOnly
            />
            <Button style={{ width: 96 }} onClick={() => setPickerOpen(true)}>
              选择产品
            </Button>
          </Space.Compact>
        </Form.Item>
        <Form.Item name="number" label="数量">
          <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入数量" />
        </Form.Item>
        <Form.Item name="community" label="小区/位置">
          <Input placeholder="请输入小区/位置" />
        </Form.Item>
        <Form.Item name="serial" label="设备序列号">
          <Input placeholder="请输入设备序列号" />
        </Form.Item>
        <Form.Item name="verificationCode" label="验证码">
          <Input placeholder="请输入验证码" />
        </Form.Item>
        <Form.Item name="remarks" label="备注">
          <Input.TextArea rows={2} placeholder="请输入备注" />
        </Form.Item>
      </Form>
      <ProductPicker
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        onSelect={onPickProduct}
      />
    </Modal>
  )
}
