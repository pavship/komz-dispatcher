import _ from 'lodash'
import React from 'react'

import { Card, List, Header, Label } from 'semantic-ui-react'

const ExecCard = ({ dayStat: { execName, time, workTypes } }) => {
  return (
    <Card className='komz-disp-card' >
      <Card.Content>
        <Card.Header>
          {execName}
          <span className='komz-float-right' >{time}ч</span>
        </Card.Header>
        {/* <Card.Meta>
          <Progress value={time} total='9' progress='ratio' />
        </Card.Meta> */}
      </Card.Content>
      <Card.Content>
        <Card.Description>
          {/* Steve wants to add you to the group <strong>best friends</strong> */}
          <List className='komz-disp-card-list' divided>

            { workTypes.map(({ workType, time, workTypeClass, workSubTypes }, i) =>
              <List.Item key={i}>
                <List.Header as='h4'>
                  <Label circular empty className={`komz-wt-${workTypeClass} komz-disp-card-Label`} />
                  {workType}
                  <span className='komz-float-right' >{time}ч</span>
                </List.Header>
                <List.List>
                  { workSubTypes.map(({ workSubType, time, models }, i) =>
                    <List.Item key={i}>
                      <List.Header className='komz-display-flex'>
                        {workSubType}
                        <span className='komz-float-right' >{time}ч</span>
                      </List.Header>
                      <List.List>
                        { models.map(({ article, name, time, prods }) => <List.Item key={article}>
                          <Header sub>{name}<span className='komz-float-right' >{time}</span></Header>
                          <List.List>
                            {prods.map(({ id, fullnumber, time }) => <List.Item key={id}>
                              {fullnumber}
                              <span className='komz-float-right' >{time}</span>
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
    </Card>
  )
}

export default ExecCard
