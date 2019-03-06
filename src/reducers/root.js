import { combineReducers } from 'redux'
import { timerReducer } from './timer'
import { clockReducer } from './clock'
import { timerDuration } from './timerDuration'
import { timerWorkerReducer } from './timerWorker'

export const reducers = combineReducers({
  clock: clockReducer,
  timer: timerReducer,
  timerDuration: timerDuration,
  timerWorker: timerWorkerReducer
})  