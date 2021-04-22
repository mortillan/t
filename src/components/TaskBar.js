import React, { memo } from 'react'

function TaskBar({ start, length, fill }) {
  
  return (
    <rect x={start} y='0' width={length} height='2320' fill={fill} />
  )
}

export default memo(TaskBar)