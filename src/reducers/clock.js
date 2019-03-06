import { TICK, tickClock } from '../actions/main'
import { TASK_KEY_FORMAT } from '../lib/constants'
import dateFormat from 'date-fns/format'

function initializeState() {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return {
    tick: ((hours * 60 * 60) + (minutes * 60) + seconds),
    tickHours: 23 - hours,
    tickMins: 59 - minutes,
    taskKey: dateFormat(new Date(), TASK_KEY_FORMAT),
  }
}

const initialState = initializeState()

export const clockReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case TICK:
      return {
        tick: data.tick,
        tickHours: data.tickHours,
        tickMins: data.tickMins,
        taskKey: data.taskKey,
      }
    default:
      return state
  }
}