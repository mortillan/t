export default () => {
  setInterval(() => {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ms = date.getMilliseconds()

    postMessage({
      timestamp: date.getTime(),
      hrs: hours,
      min: minutes,
      sec: seconds,
      ms: ms,
    });
  }, 1000)
}