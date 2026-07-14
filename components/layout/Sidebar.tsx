'use client'

import { useMemo } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import type { MenuItem } from '@/types/menu'
import { renderIcon } from './icons'

type AntdMenuItem = Required<MenuProps>['items'][number]

function toAntdItems(list: MenuItem[]): AntdMenuItem[] {
  return list.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: renderIcon(item.icon),
        label: item.label,
        children: toAntdItems(item.children),
      }
    }
    return {
      key: item.path ?? item.key,
      icon: renderIcon(item.icon),
      label: item.label,
    }
  })
}

function collectOpenKeys(list: MenuItem[], pathname: string): string[] {
  const keys: string[] = []
  for (const item of list) {
    if (item.children?.some((c) => c.path && pathname.startsWith(c.path))) {
      keys.push(item.key)
    }
  }
  return keys
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const menuList = useAppSelector((s) => s.permission.menuList)

  const items = useMemo(() => toAntdItems(menuList), [menuList])
  const openKeys = useMemo(
    () => collectOpenKeys(menuList, pathname),
    [menuList, pathname],
  )

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) {
      router.push(key)
    }
  }

  return (
    <Menu
      mode="inline"
      theme="dark"
      selectedKeys={[pathname]}
      defaultOpenKeys={openKeys}
      items={items}
      onClick={onClick}
      style={{ borderInlineEnd: 'none' }}
    />
  )
}
