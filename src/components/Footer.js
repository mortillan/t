import React, { memo } from 'react'

function Footer({ children }) {
  return (
    <footer className='footer'>
      {children}
    </footer>
  )
}

export default memo(Footer)