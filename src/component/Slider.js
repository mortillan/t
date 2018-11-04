import React from 'react';

export default function Slide(props) {
  return (
    <input className='slider is-fullwidth' 
      onChange={props.onChange} 
      value={props.val} min={props.min} 
      max={props.max} step={props.step} type='range' />
  )
}