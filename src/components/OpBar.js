import React, { Component } from 'react'

import OpPopup from './OpPopup'

import { toLocalISOString } from '../utils'

class OpBar extends Component {
  render() {
    const { op, last } = this.props
    const { time, start, works } = op
    const width = Math.round(time * 60)
    const [d, m, y] = toLocalISOString(new Date(start)).split('-').reverse()
    const date = [d.slice(0, 2), m].join('.')
    // const date = first ? [d.slice(0, 2), m, y.slice(2)].join('.') : [d.slice(0, 2), m].join('.')
    return (
      <OpPopup op={op}>
        <div>
          <div className='komz-opbar-container'>
            <div className='komz-opbar komz-main' style={{ width }}>
              {works.length > 1 && works.slice(0, -1).map(w => <div key={w.id} className='komz-opbar-divider' style={{ width: Math.round(w.time * 60) }}></div>)}
            </div>
            {!last && <div className='komz-opbar-arrow-line'></div>}
          </div>
          <div className='komz-grey komz-opbar-subheader'>
            {date}
          </div>
        </div>
      </OpPopup>
    )
  }
}

export default OpBar
