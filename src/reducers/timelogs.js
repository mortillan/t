export const initialState = {
  timeLogs: JSON.parse(localStorage.getItem('logs')) || {}
}

export const timelogReducer = (state, { type, data }) => {
  switch(type) {
    case 'GET_TIME_LOGS_TODAY':
      return state.timeLogs[data.taskKey]
    case 'GET_TIME_LOGS':
    default:
        return {
          ...state.timeLogs
        }
  }
}