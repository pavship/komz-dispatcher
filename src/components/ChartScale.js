import React, { Component } from 'react'

class ChartScale extends Component {
  render() {
    const { chartType, monthDate } = this.props
    const columns = ( chartType === 'day' ) ? 24 :
                    ( chartType === 'month' ) ? 31 : 0
    const year = monthDate && monthDate.getFullYear()
    const month = monthDate && monthDate.getMonth()
    return (
      <div className={`komz-scale komz-${chartType}-scale`}>
        <div className='komz-scale-level1'></div>
        {[...Array(columns)].map((x, i) => {
          const weekend = monthDate && [5, 6].indexOf(new Date(year, month, i).getDay()) >= 0
          return (
            <div className={`komz-scale-level2 ${weekend && 'komz-chart-column-weekend'}`} key={i} >
              { (chartType === 'day') ? i : i + 1 }
            </div>
          )
        })}
      </div>
    )
  }
}

export default ChartScale
