import React, { memo } from 'react'
import { themes } from '../lib/context'

function Brand({ theme = themes.LIGHT } = {}) {
  return (
    <div className='navbar-brand'>
      <a className='navbar-item' href='/'>
        <img src={theme === themes.LIGHT ?
          '/img/laegato-logo-light.svg' :
          '/img/laegato-logo-dark.svg'}
          alt='Laegato'
          width='110' />
      </a>
    </div>
  )
}

export default memo(Brand)