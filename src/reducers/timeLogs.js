const initialState = JSON.parse(localStorage.getItem('logs')) || {}

export const timeLogReducer = (state = initialState, { type, data }) => {
  switch(type) {
    case 'GET_TIME_LOGS_TODAY':
      return state[data.taskKey] || []
    case 'GET_TIME_LOGS':
    default:
        return state
  }
}

// export const todayLogReducer = (state, { type, data }) => {
//   switch(type) {
//     case 'GET_TIME_LOGS_TODAY':
//       return state[data.taskKey]
//     default:
//       return {}
//   }
// }