import { createSlice } from '@reduxjs/toolkit'

interface UserPrefs {
  locale: string
}

type SettingsState = {} & UserPrefs

const initialState: SettingsState = {
  locale: 'en',
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
})

// ------------------------------------
// Selectors
// ------------------------------------

// const settingsSelector = (state: { settings: SettingsState }) => state.settings

// ------------------------------------
// Actions
// ------------------------------------

export default slice.reducer
