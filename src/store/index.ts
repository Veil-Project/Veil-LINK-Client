import {
  IConfig,
  IOnInitialize,
  IAction,
  IOperator,
  IDerive,
  IState,
} from 'overmind'
import { namespaced, merge } from 'overmind/config'
import { createHook } from 'overmind-react'

import { onInitialize } from './onInitialize'
import * as effects from './effects'
import * as slices from './slices'

export const config = merge(
  {
    effects,
    onInitialize,
  },
  namespaced(slices)
)

export const useStore = createHook<typeof config>()

export interface Config extends IConfig<typeof config> {}
export interface OnInitialize extends IOnInitialize<Config> {}
export interface Action<Input = void, Output = void>
  extends IAction<Config, Input, Output> {}
export interface AsyncAction<Input = void, Output = void>
  extends IAction<Config, Input, Promise<Output>> {}
export interface Operator<Input = void, Output = Input>
  extends IOperator<Config, Input, Output> {}
export interface Derive<Parent extends IState, Output>
  extends IDerive<Config, Parent, Output> {}
