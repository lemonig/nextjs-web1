import type { MenuItem } from '@/types/menu'

/**
 * Mock 菜单数据（Phase 3 临时使用）
 * 后续替换为后端返回的 menuList。
 */
export const MOCK_MENU_LIST: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/dashboard',
  },
  {
    key: 'business',
    label: '业务管理',
    icon: 'AppstoreOutlined',
    children: [
      { key: 'orders', label: '报价管理', path: '/orders' },
      { key: 'products', label: '产品管理', path: '/products' },
      { key: 'users', label: '用户管理', path: '/users' },
    ],
  },
]
