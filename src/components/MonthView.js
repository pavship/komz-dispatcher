import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { graphql } from "react-apollo"

import { dayStats } from '../graphql/statQueries'

import { Segment, Card, Header, Icon } from 'semantic-ui-react'
import DatePicker from './DatePicker'
import ChartScale from './ChartScale'
import WorkLine from './WorkLine'
import DayBar from './DayBar'
import ExecCard from './ExecCard'

class MonthView extends Component {
  render() {
    const { dayStats: { loading, error, dayStats } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    const statsByExec = _(dayStats).sortBy('execName').groupBy('execName').reduce(function(result, value, key) {
      result.push(value)
      return result
    }, [])
    console.log(statsByExec);
    return (
      <Fragment>
        <div className='komz-no-margin komz-disp-month-grid'>
          <ChartScale chartType='month'/>
          <DatePicker selectedDay={new Date(2018,4,1)} />
          {/* <div className='komz-chart-widget-list'> */}
          <div className='komz-month-chart-widget'>
            {/* { widgetList.map(({ id, execName, fin, workType, workSubType, models }) => (
              <div className='komz-chart-widget' key={id}>
                <Header>
                  {execName}
                  <Header.Subheader className={fin && 'komz-red'}>
                    {!fin
                      ? (workSubType || workType)
                       // show warning message if exec is not registering work now, today
                      : (from.toDateString() === new Date().toDateString()) && 'Не регистрируется'}
                  </Header.Subheader>
                </Header>
                { (!fin) &&
                  <Icon name='setting' loading />
                }
                { !fin && models &&
                  <Header size='huge' sub floated='right' className='komz-disp-widget-model'>
                    {models[0].name}
                    { models[0].prods.length > 1 && ` (${models[0].prods.length}шт.)`}
                  </Header>
                }
              </div>
            )) } */}
          </div>
          <div className='komz-chart komz-month-chart'>
            {[...Array(31)].map((x, i) =>
              <div className='komz-chart-column' key={`column-${i}`} />
            )}
            {statsByExec.map((stats, i) => stats.map(stat =>
              <DayBar stat={stat} top={ i*50 } key={stat.id} />
            ))}
            {/* <div style={{color: 'black', width: 40, height: 50, backgroundColor: 'grey', position: 'absolute', left: 80, top: i*50}}></div>
            <div style={{color: 'black', width: 40, height: 50, backgroundColor: 'grey', position: 'absolute', left: 40}}></div>
            <div style={{color: 'black', width: 40, height: 50, backgroundColor: 'grey', position: 'absolute', left: 80}}></div> */}
          </div>
        </div>
        <Segment className='komz-no-margin komz-disp-cards-segment' >
          <Card.Group>
            {/* { cardWorksPerExec.map((works, i) => <ExecCard works={works} key={i}/>) } */}
          </Card.Group>
        </Segment>
      </Fragment>
    )
  }
}

export default graphql(
  dayStats,
  {
    name: 'dayStats',
    options: {
        fetchPolicy: 'cache-and-network',
    }
  }
)(MonthView)
