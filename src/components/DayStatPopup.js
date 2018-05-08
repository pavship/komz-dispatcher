import React, { Component } from 'react'

import { Popup } from 'semantic-ui-react'

import ExecCard from './ExecCard'

class DayStatPopup extends Component {
  render() {
    const { dayStat, children } = this.props
    return (
      <Popup
        trigger={children}
        position='bottom right'
        flowing
        hoverable
        // verticalOffset='-100'
        className = 'komz-daybar-popup'
      >
        <ExecCard dayStat={{...dayStat, execName: ''}} />
      </Popup>
    )
  }
}

export default DayStatPopup
