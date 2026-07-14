'use client'

import { Button, App } from 'antd'
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import screenfull from 'screenfull'

export default function HeaderFullScreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { message } = App.useApp()

  useEffect(() => {
    if (!screenfull.isEnabled) return
    const onChange = () => setIsFullscreen(screenfull.isFullscreen)
    screenfull.on('change', onChange)
    return () => screenfull.off('change', onChange)
  }, [])

  const toggle = () => {
    if (!screenfull.isEnabled) {
      message.warning('当前浏览器不支持全屏')
      return
    }
    screenfull.toggle()
  }

  return (
    <Button
      type="text"
      aria-label="全屏切换"
      icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      onClick={toggle}
    />
  )
}
