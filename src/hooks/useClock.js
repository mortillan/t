import React, { useEffect, useReducer } from 'react' 
import { clockReducer } from '../reducers/clock'
import { TICK } from '../actions/main'
import { TASK_KEY_FORMAT } from '../lib/constants'
import dateFormat from 'date-fns/format'
import worker from '../workers/clock.worker'

export const useClock = () => {
  function initClockState() {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ms = date.getMilliseconds()

    return {
      tick: ((hours * 60 * 60) + (minutes * 60) + seconds),
      tickHours: 23 - hours,
      tickMins: 59 - minutes,
      taskKey: dateFormat(new Date(), TASK_KEY_FORMAT),
    }
  }

  const [clock, clockDispatch] = useReducer(clockReducer, null, initClockState)

  useEffect(() => {
    function onTimer({ data: { timestamp, hrs, min, sec } }) {
      const total = ((hrs * 60 * 60) + (min * 60) + sec)

      clockDispatch({
        type: TICK,
        data: {
          tick: total,
          tickHours: 23 - hrs,
          tickMins: 59 - min,
          taskKey: dateFormat(new Date(timestamp), TASK_KEY_FORMAT),
        }
      })
    }

    const timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])))

    timerWorker.addEventListener('message', onTimer)

    return (() => {
      timerWorker.terminate()
    })
  }, [clock])

  return clock
}