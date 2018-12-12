import React, { memo } from 'react';

function TimeFluid({ start, fill, ...rest }) {
  return (
    <rect height='2320' y='0' x={start} width='86400' fill={fill} {...rest} />
  )
}

export default memo(TimeFluid)