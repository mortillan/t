import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import dateFormat from 'date-fns/format'

import { TICK } from '../actions/main'
import { TASK_KEY_FORMAT } from '../lib/constants'
import MinCount from './MinCount'
import HourCount from './HourCount'

import worker from '../workers/clock.worker'

export const Clock = ({ clock }) => {
  return (
    <h1 className='is-size-2 has-text-weight-semibold'>
    You have <HourCount hr={clock.tickHours} /> hours <MinCount min={clock.tickMins} /> minutes today.
    </h1>
  )
}