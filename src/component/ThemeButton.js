import React from 'react'
import { GlobalContext } from '../lib/context'

export default function ThemeButton(props) {
  return (
    <GlobalContext.Consumer>
      {({ toggleTheme }) => <button onClick={toggleTheme} className='button btn-circle theme' style={{ marginRight: '1rem' }}></button>}              
    </GlobalContext.Consumer>
  )
}