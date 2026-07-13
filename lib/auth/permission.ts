export const ROLE_MENUS: Record<number, string[]> = {}

export const getMenuList = (role: number): string[] =>
  ROLE_MENUS[role] ?? []

export const canAccess = (role: number, path: string): boolean =>
  getMenuList(role).some((m) => path.startsWith(m))
