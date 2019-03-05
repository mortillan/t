import React from 'react'
import { connect } from 'react-redux'
import { TASK_TYPES  } from '../lib/constants'
import { START_TIMER, UPDATE_TIMER } from '../actions/timer'

import worker from '../workers/timer.worker'

const Component = ({ clock, timerDuration, dispatch }) => {
  
  function onTimer({ data }) {
    dispatch({
      type: UPDATE_TIMER,
      data: {
        tick: data.tick,
        remaining: data.remaining,
      }
    })
  }
  
  const types = Object.keys(TASK_TYPES)

  return types.map(type => (
    <button key={`btn-task-${type}`} className={`button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}`}
      data-type={type} onClick={() => {
        dispatch({
          type: START_TIMER,
          data: {
            length: timerDuration,
            tick: 0,
            remaining: timerDuration,
            start: clock.tick,
            end: clock.tick + timerDuration,
            type: type,
            key: clock.taskKey,
            color: TASK_TYPES[type].color,
          }
        })

        //
        const timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])))
        timerWorker.addEventListener('message', onTimer)

        timerWorker.postMessage({
          startTick: clock.tick,
          timerDuration: timerDuration,
        })
      }}>
      {type}
    </button>
  ))
} 



const mapDispatchToProps = (dispatch, ownProps) => ({
  startTimer: () => dispatch({
    type: START_TIMER,
    data: {
  
    }
  })
})
export const TaskButtonList = connect()(Component)