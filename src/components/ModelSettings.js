import React, { Component, Fragment } from 'react'

import styled from 'styled-components'

import { Header, Form, Input } from 'semantic-ui-react'

const MLine = styled(Input)`
  display: flex;
  align-items: center;
`

class ModelSettings extends Component {

  render() {
    return (
      <Fragment>
        <Header content='Нормативные трудозатраты' />
        <Form>
          <Form.Field inline>
            <label>First name</label>
            <Input placeholder='First name' />
          </Form.Field>
        </Form>
      </Fragment>
    )
  }
}

export default ModelSettings
