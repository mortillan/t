export const TICK = 'TICK';

export const tickClock = ({ tick, tickHours, tickMins, taskKey }) => {
  return {
    type: TICK
  }
}