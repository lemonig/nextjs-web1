import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
  status: 'idle' | 'authenticating' | 'authenticated' | 'failed'
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
})

export default authSlice.reducer
