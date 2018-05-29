import React, { Component, Fragment } from 'react'

import OpPopup from './OpPopup'

class OpBar extends Component {
  render() {
    const { op, first, last } = this.props
    const { time, start } = op
    const width = Math.round(time * 60)
    const [d, m, y] = start.split('-').reverse()
    const date = [d.slice(0, 2), m].join('.')
    // const date = first ? [d.slice(0, 2), m, y.slice(2)].join('.') : [d.slice(0, 2), m].join('.')
    return (
      <OpPopup op={op}>
        <div>
          <div className='komz-opbar-container'>
            <div className='komz-opbar komz-main' style={{ width }}></div>
            {!last && <Fragment>
              <div className='komz-opbar-arrow-line'></div>
              {/* <span className='komz-opbar-arrow'>&rarr;</span> */}
            </Fragment>
            }
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
