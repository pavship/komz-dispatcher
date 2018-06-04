import React, { Component, Fragment } from 'react'

import styled from 'styled-components'

import { Header, Form, Input, List, Table } from 'semantic-ui-react'

const WstLine = styled(List.Item) `
  display: flex;
  align-items: center;
  width: 350px;
`
const Name = styled.span`
  font-size: 1.07142857em;
  margin-right: .5rem;
`
const Value = styled.span`
  width: 90px;
  float: right;
  ${(props) => props.novalue && `color: #db2828`}
`

class ModelSettings extends Component {

  render() {
    const { normatives } = this.props
    return (
      <Fragment>
        <Header content='Нормативные трудозатраты' />
        {/* <Form>
          <Form.Field inline>
            <label>First name</label>
            <Input placeholder='First name' />
          </Form.Field>
        </Form> */}
        <List>
          {normatives.map(wst => <WstLine key={wst.name}>
            <Name>{wst.name}</Name>
            <Value novalue={!wst.normative ? 1 : 0}>{wst.normative ? `${wst.normative}ч` : 'не задано'}</Value>
          </WstLine>)}
        </List>

      </Fragment>
    )
  }
}

export default ModelSettings
