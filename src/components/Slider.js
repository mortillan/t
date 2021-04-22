import React, { memo } from 'react';

function Slide({ onChange, val = 0, min = 0, max, step = 1 }) {
  return (
    <input className='slider is-fullwidth'
      onChange={onChange}
      value={val} min={min}
      max={max} step={step}
      type='range' />
  )
}

export default memo(Slide)