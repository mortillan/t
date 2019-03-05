import { combineReducers } from 'redux'
import { timerReducer } from './timer'
import { clockReducer } from './clock'

export const reducers = combineReducers({
  clockReducer,
  timerReducer
})  