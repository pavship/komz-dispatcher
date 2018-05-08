import React, { Component } from 'react'

class ChartScale extends Component {
  render() {
    const { chartType } = this.props
    const columns = ( chartType === 'day' ) ? 24 :
                    ( chartType === 'month' ) ? 31 : 0
    return (
      <div className={`komz-scale komz-${chartType}-scale`}>
        <div className='komz-scale-level1'></div>
        {[...Array(columns)].map((x, i) =>
          <div className='komz-scale-level2' key={i} >
            { (chartType === 'day') ? i : i + 1 }
          </div>
        )}
      </div>
    )
  }
}

export default ChartScale
