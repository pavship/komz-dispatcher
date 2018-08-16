import styled from 'styled-components'
import React, { Component, Fragment } from 'react'

import { Card, Label, Icon } from 'semantic-ui-react'

const ECard = styled(Card)`
  height: 420px;
  width: 500px !important;
  margin-bottom: 0 !important;
`
// Card Main Sections:
const ECardTop = styled(Card.Content)`
  padding: 0 !important
`
const ECardHeader = styled.div`
    padding: 12px 14px 8px 14px;
  `
const ECTableHeader = styled.div`
    padding: 0 14px;
    font-size: 1rem;
    color: rgba(0,0,0,.8);
    background: #f3f4f5;
    border-top: 1px solid #d4d4d5;
    border-bottom: 1px solid #d4d4d5;
  `
const ECardBody = styled(Card.Content)`
  border: none !important;
`
const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
`
const Tr = styled.tr`
  ${ECardHeader} & {
    font-weight: bold;
    font-size: 1.14285714rem;
    vertical-align: baseline;
  }
`
const ECWorkType = styled.tr`
  font-size: 1.07142857rem;
  font-weight: bold;
  `
const ECWorkSubType = styled.tr`
  font-weight: bold;
  color: rgba(0,0,0,.7);
  `
const ECModel = styled.tr`
  font-size: .88rem;
  font-weight: bold;
  cursor: pointer;
  `
const ECProd = styled.tr`
    color: rgba(0,0,0,.7);
  `
const Td = styled.td`
  // ${ECModel} & {
  //   padding-left: 7px;
  // }
  // ${ECProd} & {
  //   padding-left: 14px;
  // }
  :nth-child(1) {
    width: 230px;
    ${ECardHeader} & {
      font-size: 1.28571429rem;
    }
    ${ECWorkSubType} & {
      padding-left: 7px;
    }
    ${ECModel} & {
      padding-left: 14px;
      text-transform: uppercase;
    }
    ${ECProd} & {
      padding-left: 21px;
    }
  }
  :nth-child(2) {
    width: 80px;
  }
  :nth-child(3) {
    width: 80px;
  }
  :nth-child(4) {
    color: #570f0f;
  }
`

const ProdQtyLabel = styled(Label)`
  float: right;
  margin-right: 15px !important;
  padding: 3px 5px !important;
`
const Caret = styled(Icon)`
  transform: ${props => !props.active && 'translateX(-3px) translateY(3px) rotate(-90deg) !important'};
`

class ExecCard2 extends Component {
  state = {
    // list of expanded product lists
    activeIndex: []
  }
  handleModelLineClick = (name) => {
    const { activeIndex } = this.state
    const newIndex = activeIndex.includes(name) ? activeIndex.filter(item => item !== name) : [...activeIndex, name]
    this.setState({ activeIndex: newIndex })
  }
  render() {
    const { activeIndex } = this.state
    const { dayStat: { execName, time, nTime, cost, workTypes } } = this.props
    return (
      <ECard className='komz-disp-card' >
        <ECardTop>
          <ECardHeader>
            <Table>
              <tbody>
                <Tr>
                  <Td>{execName}</Td>
                  <Td>{time}ч</Td>
                  <Td>{nTime || '- '}ч</Td>
                  <Td>{cost || '- '}₽</Td>
                </Tr>
              </tbody>
            </Table>
          </ECardHeader>
          <ECTableHeader>
            <Table>
              <tbody>
                <Tr>
                  <Td>Трудозатраты</Td>
                  <Td>Факт</Td>
                  <Td>Норматив</Td>
                  <Td>ЗП</Td>
                </Tr>
              </tbody>
            </Table>
          </ECTableHeader>
        </ECardTop>
        <ECardBody>
          <Table>
            <tbody>
              {workTypes.map(({ workType, time, nTime, cost, workTypeClass, workSubTypes }, i) => <Fragment key={workType}>
                <ECWorkType>
                  <Td>
                    <Label circular empty className={`komz-wt-${workTypeClass} komz-disp-card-bullet`} />
                    {workType}
                  </Td>
                  <Td>{time}ч</Td>
                  <Td>{nTime || '- '}ч</Td>
                  <Td>{cost || '- '}₽</Td>
                </ECWorkType>
                {workSubTypes.map(({ workSubType, time, nTime, cost, models }, i) => <Fragment key={workSubType}>
                  <ECWorkSubType>
                    <Td>
                      {workSubType}
                    </Td>
                    <Td>{time}ч</Td>
                    <Td>{nTime || '- '}ч</Td>
                    <Td>{cost || '- '}₽</Td>
                  </ECWorkSubType>
                  {models.map(({ article, name, time, nTime, cost, prods }) => <Fragment key={article}>
                    <ECModel name={name} onClick={() => this.handleModelLineClick(name)}>
                      <Td>
                        <Caret name='dropdown' active={activeIndex.includes(name) ? 1 : 0} />
                        {name} <ProdQtyLabel color='grey' basic content={`${prods.length}шт`} />
                      </Td>
                      <Td>{time}ч</Td>
                      <Td>{nTime || '- '}ч</Td>
                      <Td>{cost || '- '}₽</Td>
                    </ECModel>
                    {activeIndex.includes(name) && prods.map(({ id, fullnumber, time, nTime, cost }) => <Fragment key={id}>
                      <ECProd>
                        <Td>
                          {fullnumber}
                        </Td>
                        <Td>{time}ч</Td>
                        <Td>{nTime || '- '}ч</Td>
                        <Td>{cost || '- '}₽</Td>
                      </ECProd>
                    </Fragment>)}
                  </Fragment>)}
                </Fragment>)}
              </Fragment>)}
            </tbody>
          </Table>


          {/* <List className='komz-disp-card-list' divided>
            {workTypes.map(({ workType, time, workTypeClass, workSubTypes }, i) =>
              <List.Item key={i}>
                <List.Header as='h4'>
                  <Line>
                    <Cell1>
                      <Label circular empty className={`komz-wt-${workTypeClass} komz-disp-card-bullet`} />
                      {workType}
                    </Cell1>
                    <Cell2>{time}ч</Cell2>
                    <Cell3>{1}ч</Cell3>
                    <Cell4>{506.0}₽</Cell4>
                  </Line>
                </List.Header>
                <List.List>
                  {workSubTypes.map(({ workSubType, time, models }, i) =>
                    <List.Item key={i}>
                      <List.Header className='komz-display-flex'>
                        <Cell1>
                          {workSubType}
                        </Cell1>
                        <Cell2>{time}ч</Cell2>
                        <Cell3>{1}ч</Cell3>
                        <Cell4>{506.0}₽</Cell4>
                      </List.Header>
                      <List.List>
                        {models.map(({ article, name, time, prods }) => <List.Item key={article}>
                          <Header sub className='komz-display-flex'>
                            <Cell1>
                              {name}
                              <Label color='grey' basic className='komz-disp-card-Label' content={`${prods.length}шт`} />
                            </Cell1>
                            <Cell2>{time}</Cell2>
                            <Cell3>{1}</Cell3>
                            <Cell4>{506.0}₽</Cell4>
                          </Header>
                          <List.List>
                            {prods.map(({ id, fullnumber, time }) => <List.Item key={id}>
                              <Line>
                                <Cell1>
                                  {fullnumber}
                                </Cell1>
                                <Cell2>{time}</Cell2>
                                <Cell3>{1}ч</Cell3>
                                <Cell4>{506.0}₽</Cell4>
                              </Line>
  
                            </List.Item>)}
                          </List.List>
                        </List.Item>)}
                      </List.List>
                    </List.Item>
                  )}
                </List.List>
              </List.Item>
            )}
          </List> */}

        </ECardBody>
      </ECard>
    )
  }
}

export default ExecCard2
