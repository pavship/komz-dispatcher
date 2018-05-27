import React, { Component } from 'react'

import { List, Header } from 'semantic-ui-react'

import OpBar from './OpBar'

class ProdLine extends Component {
  render() {
    const { prod: { fullnumber, time, ops } } = this.props
    console.log(ops)
    return (<List.Item className='komz-prod-line'>
      <Header size='small' className='komz-prod-line-header'>
        {fullnumber}
        <Header.Subheader className='komz-grey komz-prod-line-subheader'>
          {`${time}ч`}
          <span className='komz-darkred'> 520₽</span>
        </Header.Subheader>
      </Header>
      {ops.map((op, i) => <OpBar op={op} key={i} first={i === 0} last={i === ops.length - 1} />)}
    </List.Item>
    )
  }
}

export default ProdLine
