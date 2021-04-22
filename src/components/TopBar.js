import React, { memo } from 'react'

function TopBar({ brand, start, mid, end }) {
  return (
    <nav className='navbar is-fixed-top' aria-label='main navigation'>
      {brand}
      <div className="navbar-menu">
        {start}
        {mid}
        {end}
      </div>
    </nav>
  )
}

export default memo(TopBar)