import _ from 'lodash'
import React, { Component } from 'react'

import { Card, List, Header, Label } from 'semantic-ui-react'

// const ExecCard = ({ works }) => {
// const ExecCard = ({ exec: {execName, workTime, workTypes} }) => {
class ExecCard extends Component {
  timer
  state = {
    now: _.now()
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ now: _.now() })
    }, 36000)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    const { now } = this.state
    const { works } = this.props
    console.log(now);
    const aggregateTime = (col) => {
      return Math.round( col.reduce((sum, { chTime }) => sum + chTime, 0) /36000)/100
    }
    // for live works substitute finish with current time (every 36 seconds)
    const liveWork = _.find( works, { chTime: null })
    const works1 = !liveWork ? works : [
      ..._.filter( works, 'chTime' ),
      {
        ...liveWork,
        chTime: now - liveWork.chStart
      }
    ]
    const execName = works[0].execName
    const totalTime = aggregateTime(works1)
    const workTypes = _(works1).sortBy('sortIndex').groupBy('workType').reduce(
      function(workTypes, works, workType) {
        workTypes.push({
          workType,
          time: aggregateTime(works),
          workTypeClass:  (workType === 'Прямые') ? 'main' :
                          (workType === 'Косвенные') ? 'aux' :
                          (workType === 'Побочные') ? 'aside' :
                          (workType === 'Отдых') ? 'rest' : 'negative',
          workSubTypes: _(works).groupBy('workSubType').reduce(
            function(workSubTypes, works, workSubType) {
              console.log(works);
              // reject null subTypes
              workSubType !== 'null' && workSubTypes.push({
                workSubType,
                time: aggregateTime(works),
                models: _(works).groupBy('models[0].article').reduce(
                  function(models, works, article) {
                    // reject works with undefined models
                    console.log(models, works, article);
                    if (article !== 'undefined') {
                      const { name, article } = works[0].models[0]
                      const time = aggregateTime(works)
                      models.push({
                        name,
                        article,
                        time,
                        // prods: _(works).map('models[0].prods').value()
                        prods: _(works.map(({ chTime, models }) => {
                          const length = models[0].prods.length
                          return models[0].prods.map(({ id, fullnumber }) => ({
                            id,
                            fullnumber,
                            chTime: chTime/length
                          }))
                        })).flatten().groupBy('id').reduce(
                          function(prods, value, id) {
                            console.log(prods, value, id);
                            prods.push({
                              id,
                              fullnumber: value[0].fullnumber,
                              time: aggregateTime(value)
                            })
                            return prods
                          }, []
                        )
                      })
                    }
                    return models
                  }, []
                )
              })
              return workSubTypes
            }, []
          )
        })
        return workTypes
      }, []
    )
    // console.log(workTypes);
    return (
      <Card className='komz-disp-card' >
        <Card.Content>
          <Card.Header>
            {execName}
            <span className='komz-float-right' >{totalTime}ч</span>
          </Card.Header>
          {/* <Card.Meta>
            <Progress value={totalTime} total='9' progress='ratio' />
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
}

export default ExecCard
