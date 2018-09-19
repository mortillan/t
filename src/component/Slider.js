import React, { PureComponent } from 'react';

const Slider = (props) => {
  return (
    <input className='slider is-fullwidth' 
      onChange={props.onChange} 
      value={props.val} min={props.min} 
      max={props.max} step={props.step} type='range' />
  );
}

export default Slider;