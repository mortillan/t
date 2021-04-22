import { combineReducers } from 'redux'
import { timerReducer } from './timer'
import { clockReducer } from './clock'
import { timerDuration } from './timerDuration'
import { timeLogReducer, todayLogReducer } from './timeLogs'

export const reducers = combineReducers({
  clock: clockReducer,
  timer: timerReducer,
  timerDuration: timerDuration,
  todayLogs: timeLogReducer,
  timeLogs: timeLogReducer,
})  