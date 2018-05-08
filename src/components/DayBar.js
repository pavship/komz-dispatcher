import React, { Component } from 'react'

import DayStatPopup from './DayStatPopup'

class DayBar extends Component {
  render() {
    const { top, stat } = this.props
    const left = parseInt(stat.id.slice(8,10)) * 40
    // const wt = work.workType
    // const workTypeClass = (wt === 'Прямые') ? 'main' :
    //                       (wt === 'Косвенные') ? 'aux' :
    //                       (wt === 'Побочные') ? 'aside' :
    //                       (wt === 'Отдых') ? 'rest' : 'negative'
    return (
      <DayStatPopup dayStat={stat}>
        <div className='komz-daybar' style={{top, left}}
          {...['main', 'aux', 'aside', 'rest'].map((x, i) =>
            <div className={`komz-daybar-segment komz-${x}`} ></div>
          )}
        ></div>
      </DayStatPopup>
    )
  }
}

export default DayBar
