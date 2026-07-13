import { createSlice } from '@reduxjs/toolkit'
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
  reducers: {},
})

export default userSlice.reducer
