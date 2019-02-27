export const initialState = {
  timeLogs: JSON.parse(localStorage.getItem('logs')) || {}
}

export const timeLogReducer = (state, { type, data }) => {
  switch(type) {
    case 'GET_TIME_LOGS':
    default:
        return {
          ...state.timeLogs
        }
  }
}

export const todayLogReducer = (state, { type, data }) => {
  switch(type) {
    case 'GET_TIME_LOGS_TODAY':
      return state.timeLogs[data.taskKey]
  }
}