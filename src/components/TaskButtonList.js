import React from 'react'
import { TASK_TYPES  } from '../lib/constants'
import { START_TIMER } from '../actions/timer'

export const TaskButtonList = ({ clock, timerDuration, dispatch }) => {
  const types = Object.keys(TASK_TYPES)

  return types.map(type => (
    <button key={`btn-task-${type}`} className={`button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}`}
      data-type={type} onClick={() => dispatch({
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
      })}>
      {type}
    </button>
  ))
} 
