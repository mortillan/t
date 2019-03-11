import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import dateFormat from 'date-fns/format'

import { TICK } from '../actions/main'
import { TASK_KEY_FORMAT } from '../lib/constants'
import MinCount from './MinCount'
import HourCount from './HourCount'

import worker from '../workers/clock.worker'

const Component = ({ clock, updateClock }) => {
  useEffect(() => {
    function onTimer({ data: { timestamp, hrs, min, sec } }) {
      const total = ((hrs * 60 * 60) + (min * 60) + sec)
      
      updateClock({
        tick: total,
        tickHours: 23 - hrs,
        tickMins: 59 - min,
        taskKey: dateFormat(new Date(timestamp), TASK_KEY_FORMAT),
      })
    }

    const timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])))

    timerWorker.addEventListener('message', onTimer)

    return (() => {
      timerWorker.terminate()
    })
  })
  
  return (
    <h1 className='is-size-2 has-text-weight-semibold'>
    You have <HourCount hr={clock.tickHours} /> hours <MinCount min={clock.tickMins} /> minutes today.
    </h1>
  )
}

const mapStateToProps = (state, ownProps) => ({
  clock: state.clock,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateClock: (data) => dispatch({
    type: TICK,
    data: data,
  })
})

export const Clock = connect(
  mapStateToProps, 
  mapDispatchToProps
)(Component)