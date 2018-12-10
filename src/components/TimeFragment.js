import React from 'react'

class TimeFragment extends React {

  render() {
    const { start, length, fill } = this.props

    return (<rect x={start} y='0' width={length} height='2320' fill={fill} />)
  }
}

export default TimeFragment