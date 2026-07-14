'use client'

import { useEffect, useState } from 'react'
import { App } from 'antd'
import type { TreeDataNode } from 'antd'
import { productService } from '@/services/product'
import type { ProductCategory } from '@/types/product'

function toTreeData(list: ProductCategory[]): TreeDataNode[] {
  return list.map((item) => ({
    key: item.id,
    title: item.name,
    children: item.children ? toTreeData(item.children) : undefined,
  }))
}

function flatten(
  list: ProductCategory[],
  map: Map<string, ProductCategory>,
): void {
  list.forEach((item) => {
    map.set(String(item.id), item)
    if (item.children) flatten(item.children, map)
  })
}

export function useProductCategory() {
  const { message } = App.useApp()
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const list = await productService.category()
        if (active) {
          setCategories(list ?? [])
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setLoading(false)
          message.error(err instanceof Error ? err.message : '加载分类失败')
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [message])

  const treeData = toTreeData(categories)
  const categoryMap = new Map<string, ProductCategory>()
  flatten(categories, categoryMap)

  const findCategory = (id: string | number | null) =>
    id == null ? undefined : categoryMap.get(String(id))

  return { categories, treeData, loading, findCategory }
}
