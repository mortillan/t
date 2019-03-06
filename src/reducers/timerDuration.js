const UPDATE_TIMER_DURATION = 'UPDATE_TIMER_DURATION'

const initialState = 5

export const timerDuration = (state = initialState, { type, data }) => {
  switch (type) {
    case UPDATE_TIMER_DURATION:
      return data.duration
    default:
      return initialState
  }
}