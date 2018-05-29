import React from 'react'

import { Popup, Header } from 'semantic-ui-react'

const OpPopup = ({ op: { workSubType, time, cost }, children }) => (
  <Popup
    trigger={children}
    position='bottom right'
    flowing
    hoverable
  // verticalOffset='-100'
  >
    <Header className='komz-oppopup-header'>
      <Header.Content className='komz-oppopup-header-content'>
        {workSubType}
      </Header.Content>
      <Header.Subheader className='komz-grey komz-oppopup-subheader'>
        {`${time}ч`}
        <span className='komz-darkred'> {cost}₽</span>
      </Header.Subheader>
    </Header>
  </Popup>
)

export default OpPopup
