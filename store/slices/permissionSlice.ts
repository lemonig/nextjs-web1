import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { MenuItem } from '@/types/menu'

export interface PermissionState {
  role: number | null
  menuList: MenuItem[]
  permissions: string[]
}

const initialState: PermissionState = {
  role: null,
  menuList: [],
  permissions: [],
}

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<number | null>) {
      state.role = action.payload
    },
    setMenuList(state, action: PayloadAction<MenuItem[]>) {
      state.menuList = action.payload
    },
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload
    },
    clearPermission(state) {
      state.role = null
      state.menuList = []
      state.permissions = []
    },
  },
})

export const { setRole, setMenuList, setPermissions, clearPermission } =
  permissionSlice.actions
export default permissionSlice.reducer
