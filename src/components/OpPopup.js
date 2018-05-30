import React, { Fragment } from 'react'

import { Popup, Header, Accordion, List, Divider } from 'semantic-ui-react'

import { toLocalISOString } from '../utils'

const OpPopup = ({ op: { workSubType, start, fin, time, cost, works }, children }) => {
  const [stDate, stTime] = toLocalISOString(new Date(start)).slice(0, 16).split('T')
  const [fDate, fTime] = toLocalISOString(new Date(fin)).slice(0, 16).split('T')
  const worksByExec = works.length > 1 && works.reduce((wbe, w) => {
    if (wbe.length && w.execName === wbe[wbe.length - 1][0].execName) wbe[wbe.length - 1].push(w)
    else wbe.push([w])
    return wbe
  }, [])
  return (
    < Popup
      trigger={children}
      position='bottom right'
      flowing
      hoverable
    // verticalOffset='-100'
    >
      <Header className='komz-oppopup-header'>
        <Header.Content className='komz-oppopup-header-content'>
          {workSubType}
          <Header.Subheader className='komz-oppopup-time-subheader'>
            {stDate} {stDate === fDate && <i className='komz-gap' />}{stTime} - {stDate === fDate ? fTime : `${fDate} ${fTime}`}
          </Header.Subheader>
        </Header.Content>
        <Header.Subheader className='komz-oppopup-subheader'>
          {`${time}ч`}
          <span className='komz-darkred'> {cost}₽</span>
        </Header.Subheader>
      </Header>
      {works.length > 1
        ? <Fragment>
          <Divider className='komz-oppopup-divider' />
          <Accordion>
            {worksByExec.map((works, i) => {
              const execName = works[0].execName
              return (
                <div key={i} >
                  <Accordion.Title active index={i}>
                    <Header size='tiny'>
                      {execName}
                    </Header>
                  </Accordion.Title>
                  <Accordion.Content active>
                    <List size='medium' className='komz-workbar-popup-list'>
                      {works.map(({ id, start, fin, time, cost }) => {
                        const [stDate, stTime] = toLocalISOString(new Date(start)).slice(0, 16).split('T')
                        const [fDate, fTime] = toLocalISOString(new Date(fin)).slice(0, 16).split('T')
                        return <List.Item key={id}>
                          {stDate} {stDate === fDate && <i className='komz-gap' />}{stTime} - {stDate === fDate ? fTime : `${fDate} ${fTime}`}
                          <span className='komz-oppopup-sec-column'>{time}ч</span>
                        </List.Item>
                      })}
                    </List>
                  </Accordion.Content>
                </div>
              )
            })}
          </Accordion>
        </Fragment>
        : <Header size='tiny' className='komz-oppopup-execname-header'>{works[0].execName}</Header>
      }
    </Popup >
  )
}

export default OpPopup
