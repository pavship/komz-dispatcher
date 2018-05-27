import React from 'react'

import { Popup } from 'semantic-ui-react'

import ExecCard from './ExecCard'

const DayStatPopup = ({ dayStat, children }) => (
  <Popup
    trigger={children}
    position='bottom right'
    flowing
    hoverable
    // verticalOffset='-100'
    className='komz-daybar-popup'
  >
    <ExecCard dayStat={{ ...dayStat, execName: '' }} />
  </Popup>
)

export default DayStatPopup
