import React from 'react';

const Marker = (props) => {
  const { start, length, fill } = props
  return (
    <rect x={start} y='0' width={length} height='2320' fill={fill} />
  )
}

export default Marker