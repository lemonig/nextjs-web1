import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LoginStatus } from '@/types/auth'

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
  loginStatus: LoginStatus
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loginStatus: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
      state.isAuthenticated = true
      state.loginStatus = 'authenticated'
    },
    setLoginStatus(state, action: PayloadAction<LoginStatus>) {
      state.loginStatus = action.payload
    },
    clearAuth(state) {
      state.token = null
      state.isAuthenticated = false
      state.loginStatus = 'idle'
    },
  },
})

export const { setToken, setLoginStatus, clearAuth } = authSlice.actions
export default authSlice.reducer
