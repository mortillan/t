import React from 'react'

export default function Brand({ focusMode = false } = {}) {
  return (
    <div className={focusMode ? 'navbar-brand invisible' : 'navbar-brand'}>
      <a className='navbar-item' href='https://laegato.com'>
          <img src='/img/logo-laegato.png' alt='' width='110' />
      </a>
    </div>
  )
}