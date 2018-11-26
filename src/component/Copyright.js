import React, { memo } from 'react'

function Copyright() {
  return (<div style={{ fontSize: '0.875rem' }}>
    &copy; {new Date().getFullYear()} Godspeed. All rights reserved.
  </div>)
}

export default memo(Copyright)