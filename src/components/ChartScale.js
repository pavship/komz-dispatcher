import React, { Component } from 'react'

class ChartScale extends Component {
  render() {
    const { date } = this.props
    return (
      <div className='komz-scale'>
        <div className='komz-scale-level1'>{date}</div>
        {[...Array(24)].map((x, i) =>
          <div className='komz-scale-level2' key={i} >{i}</div>
        )}
      </div>
    )
  }
}

export default ChartScale
