import React from 'react'

export default function TaskTimeRemaining(props) {
  const { remaining, mode, focusMode } = props;
  return (
    <h1 className={focusMode ? 'is-size-2 has-text-weight-bold' : 'is-size-2 has-text-weight-bold hide'}>
    You have {`${Math.trunc(remaining / 60)}`.padStart(2, '0')} minutes {`${remaining % 60}`.padStart(2, '0')} seconds to #{mode}
    </h1>
  )
}