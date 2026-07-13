import { createSlice } from '@reduxjs/toolkit'

export interface PermissionState {
  menuList: string[]
  visibleMenus: string[]
}

const initialState: PermissionState = {
  menuList: [],
  visibleMenus: [],
}

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
})

export const {} = permissionSlice.actions
export default permissionSlice.reducer
