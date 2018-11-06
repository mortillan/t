import React from 'react'

export default function CountBar({ task, marker}) {
  const startTime = new Date()
  startTime.setHours(0, 0, 0, 0)
  startTime.setSeconds(task.start);
  
  const endTime = new Date()
  endTime.setHours(0, 0, 0, 0)
  endTime.setSeconds(task.start + task.length)

  const locale = 'en-US'
  const settings = { hour12: true, hour: 'numeric', minute: 'numeric'}

  return (
    <g>
      <rect x='0' y='0' width='86400' height='2320' fill={task.color} />
      <text x='864' y='1560' fontSize='1160' fill='#ffffff'>{startTime.toLocaleTimeString(locale, settings)}</text>
      <text x='81300' y='1560' fontSize='1160' fill='#ffffff'>{endTime.toLocaleTimeString(locale, settings)}</text>
    </g>
  )
}