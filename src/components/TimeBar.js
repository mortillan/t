import React from 'react'

export default function TimeBar({ fill = '#212529', fillOpacity = '.16', ...rest }) {
  return (
    <rect fill={fill} fillOpacity={fillOpacity} {...rest} x='0' y='0' width='86400' height='2320' />
  )
}