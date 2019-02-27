import React, { useReducer } from 'react'
import { TASK_TYPES  } from '../lib/constants'
import { taskReducer } from '../reducers/task'


export const TaskButtonList = ({ tick, taskDuration, taskKey }) => {
  const [task, taskDispatch] = useReducer(taskReducer)

  const types = Object.keys(TASK_TYPES)

  return types.map(type => (
    <button key={`btn-task-${type}`} className={`button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}`}
      data-type={type} onClick={() => taskDispatch({
        type: 'START_TASK',
        data: {
          length: taskDuration,
          tick: 0,
          remaining: taskDuration,
          start: tick,
          end: tick + taskDuration,
          type: type,
          key: taskKey,
        }
      })}>
      {type}
    </button>
  ))
} 
