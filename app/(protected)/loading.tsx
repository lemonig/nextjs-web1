'use client'

import { Spin } from 'antd'

export default function Loading() {
  return (
    <div style={styles.center}>
      <Spin size="large" tip="加载中...">
        <div style={{ width: 80, height: 80 }} />
      </Spin>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 240,
  },
}
