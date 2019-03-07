export default () => {
  const MAX_SECONDS = 86400

  function calculateSecondsPastMidnight(date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return ((hours * 60 * 60) + (minutes * 60) + seconds)
  }

  onmessage = function({ data }) {
    const { startTick, timerDuration } = data

    setInterval(() => {
      const total = calculateSecondsPastMidnight(new Date())
      const tick = (total - startTick) * (MAX_SECONDS / timerDuration)
      const remaining = Math.max(0, ((startTick + timerDuration) - total))
      console.log(tick, remaining)
      postMessage({
        tick: tick,
        remaining: remaining,
      })
    }, 1000)
  }
}