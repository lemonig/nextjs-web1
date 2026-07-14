import type { FlatTreeItem, TreeNode } from '@/types/common'

export function listToTree<T extends FlatTreeItem>(
  list: T[],
  rootId: T['parentId'] = null,
): Array<T & { children?: T[] }> {
  const map = new Map<T['id'], T & { children?: T[] }>()
  list.forEach((item) => map.set(item.id, { ...item }))

  const roots: Array<T & { children?: T[] }> = []
  map.forEach((node) => {
    if (node.parentId === rootId || node.parentId == null) {
      roots.push(node)
      return
    }
    const parent = map.get(node.parentId)
    if (parent) {
      parent.children = parent.children ?? []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

export function findTreeNode<T>(
  nodes: TreeNode<T>[],
  key: TreeNode<T>['key'],
): TreeNode<T> | undefined {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.children?.length) {
      const found = findTreeNode(node.children, key)
      if (found) return found
    }
  }
  return undefined
}

export function flattenTree<T>(nodes: TreeNode<T>[]): TreeNode<T>[] {
  const result: TreeNode<T>[] = []
  const walk = (list: TreeNode<T>[]) => {
    list.forEach((node) => {
      result.push(node)
      if (node.children?.length) walk(node.children)
    })
  }
  walk(nodes)
  return result
}
