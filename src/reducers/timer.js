import {
  START_TIMER,
  STOP_TIMER,
  UPDATE_TIMER,
} from '../actions/timer'

const initialState = null

export const timerReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case UPDATE_TIMER:
      return {
        ...state,
        tick: data.tick,
        remaining: data.remaining,
      }
    case START_TIMER:
      return {
        length: data.length,
        start: data.start,
        end: data.end,
        type: data.type,
        color: data.color,
        tick: data.tick,
        remaining: data.remaining,
        key: data.key,
        worker: data.worker,
      }
    case STOP_TIMER:
      state.worker.terminate()
      return null
    default:
      return null
  }
}