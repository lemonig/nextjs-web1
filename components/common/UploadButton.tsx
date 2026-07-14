'use client'

import { Button, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'
import type { UploadResult } from '@/types/common'

export interface UploadButtonProps extends Omit<UploadProps, 'onChange'> {
  buttonText?: ReactNode
  onDone?: (result: UploadResult) => void
  onError?: (error: Error) => void
}

export default function UploadButton({
  action,
  buttonText = '上传文件',
  onDone,
  onError,
  ...rest
}: UploadButtonProps) {
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'done') {
      onDone?.({
        name: file.name,
        url: file.url ?? file.response?.url,
        status: 'done',
        response: file.response,
      })
    } else if (file.status === 'error') {
      onError?.(new Error(`${file.name} 上传失败`))
    }
  }

  return (
    <Upload action={action} onChange={handleChange} {...rest}>
      <Button icon={<UploadOutlined />}>{buttonText}</Button>
    </Upload>
  )
}
