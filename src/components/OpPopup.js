import React from 'react'

import { Popup, Header } from 'semantic-ui-react'

const OpPopup = ({ op, children }) => (
  <Popup
    trigger={children}
    position='bottom right'
    flowing
    hoverable
    // verticalOffset='-100'
    className='komz-daybar-popup'
  >
    <Header>
      <Header.Content>
        {op.workSubType}
        {/* <Header.Subheader>
              {!work.fin && 'с '}{DateTime.fromISO(work.start).toFormat("HH':'mm")}{work.fin && ` - ${DateTime.fromISO(work.fin).toFormat("HH':'mm")}` }
            </Header.Subheader> */}
      </Header.Content>
    </Header>
  </Popup>
)

export default OpPopup
