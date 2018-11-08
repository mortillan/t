import React from 'react'

export default function TaskBar({ start, length, fill }) {
  
  return (
    <rect x={start} y='0' width={length} height='2320' fill={fill} />
  )
}