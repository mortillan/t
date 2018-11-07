import React from 'react'

export default function TaskBar({ start, end, fill }) {
  return (
    <rect x={start} y='0' width={end - start} height='2320' fill={fill} />
  )
}