import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

export interface UserState {
  info: User | null
  role: number | null
}

const initialState: UserState = {
  info: null,
  role: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.info = action.payload
      state.role = action.payload.role ?? null
    },
    clearUser(state) {
      state.info = null
      state.role = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
