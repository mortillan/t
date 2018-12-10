import React from 'react'

export default function TimeBar({ fill = '#212529', fillOpacity = '.16' }) {
  return (
    <rect fill={fill} fillOpacity={fillOpacity} x='0' y='0' width='86400' height='2320' rx='250' ry='250' />
  )
}