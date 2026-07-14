'use client'

import { useEffect, useState } from 'react'
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  App,
  Upload,
} from 'antd'
import type { UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { quotationService } from '@/services/quotation'
import type {
  Quotation,
  QuotationAttachment,
  QuotationFormValues,
} from '@/types/quotation'
import type { UploadEvidenceResult } from '@/types/common-api'

const UPLOAD_ACTION = `${process.env.NEXT_PUBLIC_API_BASE ?? '/api'}/upload/evidence`

interface OrderFormDrawerProps {
  open: boolean
  editing: Quotation | null
  onClose: () => void
  onSuccess: () => void
}

export default function OrderFormDrawer({
  open,
  editing,
  onClose,
  onSuccess,
}: OrderFormDrawerProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<QuotationFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const attachment = Form.useWatch('attachment', form) as
    | QuotationAttachment
    | undefined

  const isEdit = !!editing

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.setFieldsValue({
        project: editing.project,
        organization: editing.organization,
        expiryDate: editing.expiryDate,
        contractDetail: editing.contractDetail,
        description: editing.description,
        playerId: editing.playerId,
        attachment: editing.attachment,
      })
    } else {
      form.resetFields()
    }
  }, [open, editing, form])

  const handleUploadChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'done') {
      const res = file.response as
        | { data?: UploadEvidenceResult }
        | UploadEvidenceResult
        | undefined
      const data =
        res && 'data' in (res as { data?: UploadEvidenceResult })
          ? (res as { data?: UploadEvidenceResult }).data
          : (res as UploadEvidenceResult | undefined)
      if (data?.filePath) {
        form.setFieldValue('attachment', {
          filePath: data.filePath,
          originalFilename: data.originalFilename ?? file.name,
        })
        message.success('附件上传成功')
      }
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`)
    }
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    setSubmitting(true)
    try {
      if (isEdit && editing) {
        await quotationService.update({ id: editing.id, ...values })
        message.success('更新成功')
      } else {
        await quotationService.insert(values)
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
    <Drawer
      title={isEdit ? '编辑报价单' : '新增报价单'}
      open={open}
      onClose={onClose}
      width={520}
      destroyOnClose
      maskClosable={false}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" loading={submitting} onClick={handleSubmit}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="project"
          label="项目"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          name="organization"
          label="单位"
          rules={[{ required: true, message: '请输入单位名称' }]}
        >
          <Input placeholder="请输入单位名称" />
        </Form.Item>
        <Form.Item
          name="expiryDate"
          label="有效期"
          getValueProps={(v) => ({ value: v ? dayjs(v as string) : null })}
          normalize={(v) =>
            v ? (v as dayjs.Dayjs).format('YYYY-MM-DD') : undefined
          }
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="contractDetail" label="合同明细">
          <Input.TextArea rows={3} placeholder="请输入合同明细" />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <Input.TextArea rows={3} placeholder="请输入说明" />
        </Form.Item>
        <Form.Item name="playerId" label="关联人 ID">
          <Input placeholder="请输入关联人 ID" />
        </Form.Item>
        <Form.Item name="attachment" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="附件">
          <Upload
            action={UPLOAD_ACTION}
            showUploadList={false}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>上传附件</Button>
          </Upload>
          {attachment && (
            <div style={{ marginTop: 8 }}>
              已上传：{attachment.originalFilename}
            </div>
          )}
        </Form.Item>
      </Form>
    </Drawer>
  )
}
