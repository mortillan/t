import React from 'react'
import ReactDOM from 'react-dom'
import Slider from '../Slider'

describe('Slider', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Slider onChange={jest.fn()} />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

})