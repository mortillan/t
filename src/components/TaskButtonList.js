import React, { memo } from 'react'
import { connect } from 'react-redux'
import { TASK_TYPES } from '../lib/constants'
import { START_TIMER, UPDATE_TIMER } from '../actions/timer'

import worker from '../workers/timer.worker'

const Component = ({ clock, timerDuration, startTimer }) => {
  const types = Object.keys(TASK_TYPES)

  return types.map(type => (
    <button key={`btn-task-${type}`} className={`button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}`}
      data-type={type} onClick={() => startTimer(type, clock, timerDuration)}>
      {type}
    </button>
  ))
}

const mapStateToProps = state => ({
  clock: state.clock,
  timerDuration: state.timerDuration,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  startTimer: (type, clock, timerDuration) => {
    console.log(clock)
    const duration = timerDuration * 60

    const timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])))
    timerWorker.addEventListener('message', ({ data }) => {
      dispatch({
        type: UPDATE_TIMER,
        data: {
          tick: data.tick,
          remaining: data.remaining,
        }
      })
    })

    timerWorker.postMessage({
      startTick: clock.tick,
      timerDuration: duration,
    })

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
        worker: timerWorker,
      }
    })
  }
})

export const TaskButtonList = memo(connect(
  mapStateToProps,
  mapDispatchToProps
)(Component))