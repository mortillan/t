import React, { memo } from 'react'
import { connect } from 'react-redux'
import { TASK_TYPES } from '../lib/constants'
import { START_TIMER, UPDATE_TIMER } from '../actions/timer'
import { calculateSecondsPastMidnight } from '../lib/common'


import worker from '../workers/timer.worker'
const MAX_SECONDS = 86400

function Component({ clock, timerDuration, startTimer }) {
  const types = Object.keys(TASK_TYPES)

  return types.map(type => (
    <button key={`btn-task-${type}`} className={`button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}`}
      data-type={type} onClick={() => startTimer(clock, timerDuration, type)}>
      {type}
    </button>
  ))
}

const mapStateToProps = (state, ownProps) => ({
  clock: state.clock,
  timerDuration: state.timerDuration,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  startTimer: (clock, timerDuration, type) => {
    // const { type } = target.dataset
    // const { clock, timerDuration } = ownProps
    const duration = timerDuration * 60

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

      dispatch({
        type: START_TIMER,
        data: {
          length: duration,
          tick: 0,
          remaining: duration,
          start: clock.tick,
          end: clock.tick + duration,
          type: type,
          key: clock.taskKey,
          color: TASK_TYPES[type].color,
          timerId: setInterval(() => {
            const total = calculateSecondsPastMidnight(new Date())
            const tick = (total - clock.tick) * (MAX_SECONDS / duration)
            const remaining = Math.max(0, ((clock.tick + duration) - total))

            dispatch({
              type: UPDATE_TIMER,
              data: {
                tick: tick,
                remaining: remaining,
              }
            })

            document.title = `${Math.trunc(remaining / 60)}`.padStart(2, '0') + ':' + `${remaining % 60}`.padStart(2, '0')

          }, 1000),
        }
      })

    // dispatch({
    //   type: START_TIMER,
    //   data: {
    //     length: duration,
    //     tick: 0,
    //     remaining: duration,
    //     start: clock.tick,
    //     end: clock.tick + duration,
    //     type: type,
    //     key: clock.taskKey,
    //     color: TASK_TYPES[type].color,
    //     worker: timerWorker,
    //   }
    // })

    // timerWorker.postMessage({
    //   startTick: clock.tick,
    //   timerDuration: duration,
    // })
  }
})

export const TaskButtonList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)