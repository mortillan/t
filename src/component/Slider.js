import React, { PureComponent } from 'react';

const Slider = (props) => {
  return (
    <input onChange={props.onChange} className="slider is-fullwidth is-circle" 
    step="1" min={props.min} max={props.max} value={props.slider} type="range" style={{margin: '0'}} />
  );
}

export default Slider;