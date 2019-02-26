import { TICK, tickClock } from '../actions/main'

export const clockReducer = (state, { type, data }) => {
  
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