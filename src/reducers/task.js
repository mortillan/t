export const taskReducer = (state, { type, data }) => {
  console.log(state, type, data)
  switch (type) {
    case 'START_TASK':
      return {
        length: data.length,
        start: data.start,
        end: data.end,
        type: data.type,
        color: data.color,
        tick: data.tick,
        remaining: data.remaining,
        key: data.key,
      }
    case 'STOP_TASK':
      return null
    default:
      break
  }
}