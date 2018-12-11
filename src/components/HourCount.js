import React, { memo } from 'react'

function HourCount({ hr }) {
  return (
    <>{hr}</>
  )
}

export default memo(HourCount)