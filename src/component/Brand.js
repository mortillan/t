import React, { memo } from 'react'
import { themes } from '../lib/context'

function Brand({ theme = themes.LIGHT, focusMode = false } = {}) {
  return (
    <div className={focusMode ? 'navbar-brand is-invisible' : 'navbar-brand'}>
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