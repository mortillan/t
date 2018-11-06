import React from 'react';

export default function Marker({ start, length, fill }) {
  return (
    <rect height='2320' y='0' x={start} width={length} fill={fill} />
  )
}