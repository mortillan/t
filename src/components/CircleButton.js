import React from 'react'

export default function CircleButton({ 
  backgroundColor = '#ffffff', 
  size = '2rem', 
  marginRight = '1.5rem',
  ...rest }) {

  return (
    <button {...rest}
      style={{ 
        marginRight: marginRight,
        borderRadius: '50%',
        width: size,
        height: size,
        backgroundColor: backgroundColor,
        border: 'none',
      }}>
    </button>
  )

}