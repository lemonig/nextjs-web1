'use client'

import { useEffect } from 'react'
import { Result, Button } from 'antd'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Result
      status="error"
      title="页面出错了"
      subTitle={error.message || '发生未知错误，请稍后重试。'}
      extra={
        <Button type="primary" onClick={() => reset()}>
          重试
        </Button>
      }
    />
  )
}
