import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

export interface UserState {
  info: User | null
  role: number | null
  menuList: string[]
}

const initialState: UserState = {
  info: null,
  role: null,
  menuList: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.info = action.payload
      state.role = action.payload.role ?? null
    },
    setMenuList(state, action: PayloadAction<string[]>) {
      state.menuList = action.payload
    },
    clearUser(state) {
      state.info = null
      state.role = null
      state.menuList = []
    },
  },
})

export const { setUser, setMenuList, clearUser } = userSlice.actions
export default userSlice.reducer
