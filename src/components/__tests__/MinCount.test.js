import React from 'react'
import ReactDOM from 'react-dom'
import MinCount from '../MinCount'

describe('MinCount', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<MinCount />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

})