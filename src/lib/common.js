import { inspect } from 'util'

export const taskKey = (date) => {
  return date.toLocaleDateString()
}

export const log = (data) => {
  return console.log(inspect(data, { showHidden: true, depth: null }))
}

export function calculateSecondsPastMidnight(date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return ((hours * 60 * 60) + (minutes * 60) + seconds)
}