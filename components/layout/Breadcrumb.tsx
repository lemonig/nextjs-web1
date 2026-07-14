'use client'

import { useMemo } from 'react'
import { Breadcrumb } from 'antd'
import type { BreadcrumbProps } from 'antd'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import type { MenuItem } from '@/types/menu'

type Crumb = Required<BreadcrumbProps>['items'][number]

function findTrail(
  list: MenuItem[],
  pathname: string,
  trail: string[] = [],
): string[] | null {
  for (const item of list) {
    const nextTrail = [...trail, item.label]
    if (item.path && pathname.startsWith(item.path)) {
      return nextTrail
    }
    if (item.children) {
      const found = findTrail(item.children, pathname, nextTrail)
      if (found) return found
    }
  }
  return null
}

export default function AppBreadcrumb() {
  const pathname = usePathname()
  const menuList = useAppSelector((s) => s.permission.menuList)

  const items: Crumb[] = useMemo(() => {
    const trail = findTrail(menuList, pathname)
    if (!trail) return [{ title: '首页' }]
    return trail.map((title) => ({ title }))
  }, [menuList, pathname])

  return <Breadcrumb items={items} style={{ margin: '16px 0' }} />
}
