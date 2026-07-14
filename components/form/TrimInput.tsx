'use client'

import { Input } from 'antd'
import type { InputProps, InputRef } from 'antd'
import { forwardRef } from 'react'

export type TrimInputProps = InputProps

const TrimInput = forwardRef<InputRef, TrimInputProps>(function TrimInput(
  { onChange, onBlur, ...rest },
  ref,
) {
  const handleBlur: InputProps['onBlur'] = (e) => {
    const trimmed = e.target.value.trim()
    if (trimmed !== e.target.value) {
      e.target.value = trimmed
      onChange?.(e)
    }
    onBlur?.(e)
  }

  return <Input ref={ref} onChange={onChange} onBlur={handleBlur} {...rest} />
})

export default TrimInput
