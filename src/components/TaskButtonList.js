import React, { useReducer } from 'react'
import { TASK_TYPES  } from '../lib/constants'
import { taskReducer } from '../reducers/task'


export const TaskButtonList = () => {
  const [task, taskDispatch] = useReducer(taskReducer)

  const types = Object.keys(TASK_TYPES)

  return types.map(type => (
    <button key={`btn-task-${type}`} className={`button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}`}
      data-type={type} onClick={() => taskDispatch({

        type: type,
      })}>
      {type}
    </button>
  ))
} 
