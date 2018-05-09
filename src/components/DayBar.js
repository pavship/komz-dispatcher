import React, { Component } from 'react'

import DayStatPopup from './DayStatPopup'

class DayBar extends Component {
  render() {
    const { top, stat } = this.props
    const left = (new Date(Date.parse(stat.id.slice(0,24))).getDate() - 1) * 40
    return (
      <DayStatPopup dayStat={stat}>
        <div className='komz-daybar' style={{top, left}}>
          { stat.workTypes.map(wt =>
            <div className={`komz-daybar-segment komz-${wt.workTypeClass}`}
              style={{height: Math.round(wt.time/24*48)}}
              key={wt.workType}>
            </div>
          )}
        </div>
      </DayStatPopup>
    )
  }
}

export default DayBar
