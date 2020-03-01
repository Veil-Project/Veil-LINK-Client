export type AppStatus =
  | 'initializing'
  | 'login'
  | 'setup'
  | 'wallet'
  | 'error'
  | 'terminating'

type State = {
  locale: string
  status: AppStatus
}

export const state: State = {
  locale: 'en',
  status: 'initializing',
}
