import { createSlice } from '@reduxjs/toolkit'

export interface AppState {
  appName: string
  systemBelong: string
  footerMessage: string
}

const initialState: AppState = {
  appName: '',
  systemBelong: '',
  footerMessage: '',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
})

export default appSlice.reducer
