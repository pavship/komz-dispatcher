import React, { Component, Fragment } from 'react'

import styled from 'styled-components'

import { Accordion, Label, Icon, Segment } from 'semantic-ui-react'

const MLine = styled(Accordion.Title)`
  display: flex;
  align-items: center;
`
const MSubLine = styled.div`
  display: flex;
  align-items: center;
  width: 253px;
`
// MHeader is a <Header size='small' />
const MHeader = styled.span`
  font-size: 1.07142857em;
  font-weight: bold;
  margin-right: .5rem;
`
const MIcon = styled(Icon)`
  cursor: pointer;
  position: relative;
  && {
    margin-left: auto;
    height: auto;
    transition: opacity .5s ease;
    opacity: 0 ;
  } 
  &:after {
    visibility: hidden;
    position: absolute;
    content: '';
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(30%) rotate(225deg);
    background-color: #f3f4f5;
    margin: .5px 0 0;
    width: .57142857em;
    height: .57142857em;
    border: none;
    border-bottom: 1px solid #d4d4d5;
    border-right: 1px solid #d4d4d5;
    z-index: 2;
    transition: background .1s ease;
  }
  ${MLine}:hover & {
    opacity: 0.7;
  }
  &&:hover {
    opacity: 0.9;
  }
  ${props => props.active && `
    opacity: 0.9 !important;
    &:after {
      visibility: visible;
    }
  `}
`
const Settings = styled(Segment)`
  z-index: -1;
  margin-bottom: 0 !important;
  ${props => props.noBorder && `
    border-bottom: none !important;
  `}
`

class ModelLine extends Component {
  state = {
    showSettings: false
  }
  toggleSettings = (e) => {
    e.stopPropagation()
    this.setState({ showSettings: !this.state.showSettings })
  }
  render() {
    const { showSettings } = this.state
    const { name, qty, active } = this.props
    return (
      <Fragment>
        <MLine {...this.props}>
          <Icon name='dropdown' />
          <MSubLine>
            <MHeader>{name}</MHeader>
            <Label color='grey' content={qty} />
            <MIcon name='setting' size='large' onClick={this.toggleSettings} active={showSettings ? 1 : 0}/>
          </MSubLine>
        </MLine>
        {showSettings &&
          <Settings attached='bottom' secondary compact noBorder={active}>
            This segment is on bottom
          </Settings>
        }
        {/* {showSettings && active &&

        } */}
      </Fragment>
    )
  }
}

export default ModelLine
