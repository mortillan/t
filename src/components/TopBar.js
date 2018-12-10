import React from 'react'

export default function TopBar(props) {
  return (
    <nav className='navbar is-fixed-top' aria-label='main navigation'>
      {props.brand}
      <div className="navbar-menu">
        {props.start}
        {props.mid}
        {props.end}
      </div>
    </nav>
  )
}