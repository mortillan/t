import React, { memo } from 'react'

function MinCount({ min }) {
  return (
    <>{min}</>
  )
}

export default memo(MinCount);