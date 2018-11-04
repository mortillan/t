import React from 'react'

const Timebar = (props) => {
  const { fill } = props

  return (
    <rect x='0' y='0' width='86400' height='2320' fill={fill} fillOpacity='.16' />
  )
}

export default Timebar