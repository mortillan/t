import React from 'react'
import ReactDOM from 'react-dom'
import HourCount from '../HourCount'

describe('HourCount', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<HourCount />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

})