import React from 'react'
import { connect } from 'react-redux'

const Component = ({ timer }) => {
  return (
    <h1 className='is-size-2 has-text-weight-semibold'>
    You have {`${Math.trunc(timer.remaining / 60)}`.padStart(2, '0')} minutes {`${timer.remaining % 60}`.padStart(2, '0')} seconds to #{timer.mode}
    </h1>
  )
}

const mapStateToProps = (state, ownProps) => ({
  timer: state.timer,
})

export const CountDown = connect(mapStateToProps)(Component)