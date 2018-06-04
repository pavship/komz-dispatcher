import styled from 'styled-components'
import React from 'react'

import { Card, List, Header, Label, Segment } from 'semantic-ui-react'

import { normatives } from '../constants'

const ECard = styled(Card) `
  height: 420px;
  width: 470px !important;
  margin-bottom: 0 !important;
`
const Line = styled.div`
  display: flex;
`
const Cell = styled.span`
  flex-shrink: 0;
`
const Cell1 = Cell.extend`

`
const Cell2 = Cell.extend`
  width: 70px;
  margin-left: auto;
`
const Cell3 = Cell.extend`
  width: 70px;
`
const Cell4 = Cell.extend`
  width: 70px;
  color: #570f0f;
`
const Settings = styled(Segment) `
  margin-bottom: 0 !important;
  border-radius: 0 !important;
`


const ExecCard = ({ dayStat: { execName, time, workTypes } }) => {
  return (
    <ECard className='komz-disp-card' >
      <Card.Content>
        <Card.Header>
          {execName}
          <span className='komz-float-right' >{time}ч</span>
        </Card.Header>
        <Settings attached='bottom' secondary compact>
          <Line>
            <Cell1>
              Трудозатраты
          </Cell1>
            <Cell2>Факт</Cell2>
            <Cell3>Норматив</Cell3>
            <Cell4>ЗП</Cell4>
          </Line>
        </Settings>
      </Card.Content>
      <Card.Content>
        <Card.Description>



          <List className='komz-disp-card-list' divided>
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
          </List>
        </Card.Description>
      </Card.Content>
    </ECard>
  )
}

export default ExecCard
