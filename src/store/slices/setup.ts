import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import * as Bip39 from 'bip39'
import { AppThunk } from 'store'
import scorePassword from 'utils/scorePassword'

// ------------------------------------
// Types
// ------------------------------------

interface Seed {
  seed: Array<string>
  seedIsVisible: boolean
  seedConfirmation: Array<string>
  focusedSeedIndex: number
}

interface Password {
  password: string
  passwordConfirmation: string
}

interface SeedConfirmationPayload {
  index: number
  value: string
}

export type Mode = 'create-wallet' | 'restore-wallet' | 'open-wallet'
type SetupState = {
  mode: Mode
  step: number
} & Seed &
  Password

// ------------------------------------
// Slice
// ------------------------------------

const initialState: SetupState = {
  mode: 'create-wallet',
  step: 0,
  seed: [],
  seedIsVisible: false,
  seedConfirmation: [],
  focusedSeedIndex: 0,
  password: '',
  passwordConfirmation: '',
}

const slice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    switchMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setSeed: (state, action: PayloadAction<Array<string>>) => {
      state.seed = action.payload
      state.seedConfirmation = []
      state.seedIsVisible = false
    },
    toggleSeedVisibility: state => {
      state.seedIsVisible = !state.seedIsVisible
    },
    setSeedConfirmationValue: (
      state,
      action: PayloadAction<SeedConfirmationPayload>
    ) => {
      const { index, value } = action.payload
      state.seedConfirmation[index] = value.toLowerCase().replace(' ', '')
    },
    setFocusedSeedIndex: (state, action: PayloadAction<number>) => {
      state.focusedSeedIndex = action.payload
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    },
    setPasswordConfirmation: (state, action: PayloadAction<string>) => {
      state.passwordConfirmation = action.payload
    },
  },
})

// ------------------------------------
// Selectors
// ------------------------------------

const setupSelector = (state: { setup: SetupState }) => state.setup
const modeSelector = createSelector(setupSelector, setup => setup.mode)
const stepSelector = createSelector(setupSelector, setup => setup.step)
const seedSelector = createSelector(setupSelector, setup => setup.seed)
const seedVisibilitySelector = createSelector(
  setupSelector,
  setup => setup.seedIsVisible
)
const seedConfirmationSelector = createSelector(
  setupSelector,
  setup => setup.seedConfirmation
)
const focusedSeedIndexSelector = createSelector(
  setupSelector,
  setup => setup.focusedSeedIndex
)
const currentSeedConfirmationValueSelector = createSelector(
  seedConfirmationSelector,
  focusedSeedIndexSelector,
  (seedConfirmation, focusedIndex) => seedConfirmation[focusedIndex]
)
const passwordSelector = createSelector(setupSelector, setup => setup.password)
const passwordConfirmationSelector = createSelector(
  setupSelector,
  setup => setup.passwordConfirmation
)

export const selectors = {
  mode: modeSelector,
  step: stepSelector,
  seed: seedSelector,
  seedIsVisible: seedVisibilitySelector,
  seedConfirmation: seedConfirmationSelector,
  focusedSeedIndex: focusedSeedIndexSelector,
  isSeedConfirmationValid: createSelector(
    seedSelector,
    seedConfirmationSelector,
    (seed, seedConfirmation) =>
      JSON.stringify(seed) === JSON.stringify(seedConfirmation)
  ),
  password: passwordSelector,
  passwordConfirmation: passwordConfirmationSelector,
  passwordStrength: createSelector(passwordSelector, password =>
    scorePassword(password)
  ),
  isPasswordValid: createSelector(
    passwordSelector,
    passwordConfirmationSelector,
    (password, passwordConfirmation) =>
      password === passwordConfirmation && scorePassword(password) > 60
  ),
  seedAutocompleteMatches: createSelector(
    currentSeedConfirmationValueSelector,
    currentValue =>
      currentValue
        ? Bip39.wordlists.english
            .filter(w => w.startsWith(currentValue))
            .slice(0, 5)
        : []
  ),
}

// ------------------------------------
// Actions
// ------------------------------------

export const generateSeed = (): AppThunk => async dispatch => {
  try {
    const seed = await Bip39.generateMnemonic(256)
    dispatch(slice.actions.setSeed(seed.split(' ')))
  } catch (e) {
    console.error(e)
  }
}

export const {
  switchMode,
  setStep,
  setSeed,
  toggleSeedVisibility,
  setSeedConfirmationValue,
  setFocusedSeedIndex,
  setPassword,
  setPasswordConfirmation,
} = slice.actions

export default slice.reducer
