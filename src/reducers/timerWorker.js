// import worker from '../workers/timer.worker'
// import { UPDATE_TIMER } from '../actions/timer'
const initialState = null

export const timerWorkerReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case 'START_TIMER_WORKER': {
      // const timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])))
      // timerWorker.addEventListener('message', ({ data }) => {
      //   dispatch({
      //     type: UPDATE_TIMER,
      //     data: {
      //       tick: data.tick,
      //       remaining: data.remaining,
      //     }
      //   })
      // })

      // timerWorker.postMessage({
      //   startTick: data.tick,
      //   timerDuration: data.duration,
      // })

      return data.timerWorker
    }
    case 'STOP_TIMER_WORKER':
    default: {
      return null
    }
  }
}