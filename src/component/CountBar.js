import React from 'react'

class CountBar extends React.PureComponent {
  render() {
    const { task, marker } = this.props

    const startTime = new Date()
    startTime.setHours(0)
    startTime.setMinutes(0)
    startTime.setSeconds(0)
    startTime.setSeconds(task.start);
    
    const endTime = new Date()
    endTime.setHours(0)
    endTime.setMinutes(0)
    endTime.setSeconds(0)
    endTime.setSeconds(task.start + task.length)

    const locale = 'en-US'
    const settings = { hour12: true, hour: 'numeric', minute: 'numeric'}

    return (
      <g>
        <rect x='0' y='0' width='86400' fill={task.color} height='2320' />
        {marker}
        <text x='864' y='1560' fontSize='1160' fill='#ffffff'>{startTime.toLocaleTimeString(locale, settings)}</text>
        <text x='81300' y='1560' fontSize='1160' fill='#ffffff'>{endTime.toLocaleTimeString(locale, settings)}</text>
      </g>
    )
  }
}

export default CountBar