import React from 'react'
import ReactDOM from 'react-dom'
import CircleButton from '../CircleButton'

describe('CircleButton', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<CircleButton />, div)
    ReactDOM.unmountComponentAtNode(div)
  })


})