import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

interface Command {
  timestamp: Date,
  command: string,
}

type ConsoleState = {
  currentCommand: string,
  commands: Command[]
}

const initialState: ConsoleState = {
  currentCommand: "",
  commands: []
}

// ------------------------------------
// Slice
// ------------------------------------

const slice = createSlice({
  name: 'console',
  initialState,
  reducers: {
    sendCommand: (state, action: PayloadAction<string>) => {
      state.commands.push({
        timestamp: new Date(),
        command: action.payload,
      })
      state.currentCommand = ""
    },
    setCurrentCommand: (state, action: PayloadAction<string>) => {
      state.currentCommand = action.payload
    }
  }
})

// ------------------------------------
// Selectors
// ------------------------------------

const consoleSelector = (state: { console: ConsoleState }) => state.console
const selectors = {
  currentCommand: createSelector(
    consoleSelector,
    console => console.currentCommand
  ),
  commands: createSelector(
    consoleSelector,
    console => console.commands
  )
}

const { actions } = slice
export { selectors, actions }
export default slice.reducer