import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { graphql } from "react-apollo"

import { Segment, Card, Header, Icon } from 'semantic-ui-react'
import DatePicker from './DatePicker'
import ChartScale from './ChartScale'
import WorkLine from './WorkLine'
import DayBar from './DayBar'
import ExecCard from './ExecCard'

import { wtSortRule } from '../constants'
import { dayStats } from '../graphql/statQueries'

class MonthView extends Component {
  render() {
    const { dayStats: { loading, error, dayStats } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    // convert milliseconds into hours with 2 digits after dot precision
    const msToHours = (ms) => Math.round(ms/3600000*100)/100
    const preparedStats = dayStats.map(stat => ({
      ...stat,
      time: msToHours(stat.time),
      workTypes: _.sortBy(stat.workTypes, [function(wt) { return wtSortRule.indexOf(wt.workType); }]).map(workType => ({
        ...workType,
        time: msToHours(workType.time),
        workSubTypes: workType.workSubTypes.map(workSubType => ({
          ...workSubType,
          time: msToHours(workSubType.time),
          models: workSubType.models.map(model => ({
            ...model,
            time: msToHours(model.time),
            prods: model.prods.map(prod => ({
              ...prod,
              time: msToHours(prod.time)
    })) })) })) })) }))
    const statsByExec = _(preparedStats).sortBy('execName').groupBy('execName').reduce(function(result, value, key) {
      result.push(value)
      return result
    }, [])
    // console.log(statsByExec);
    return (
      <Fragment>
        <div className='komz-no-margin komz-disp-month-grid'>
          <ChartScale chartType='month'/>
          <DatePicker selectedDay={new Date(2018,4,1)} />
          <div className='komz-chart-widget-area'>
            { statsByExec.map(stats => {
              const { id, execName, time } = stats[0]
              return (
              <div className='komz-chart-widget' key={id}>
                <Header>
                  {execName}
                  <Header.Subheader>
                    {`${time}ч`}
                  </Header.Subheader>
                </Header>
              </div>
            )}) }
          </div>
          <div className='komz-chart komz-month-chart'>
            {[...Array(31)].map((x, i) =>
              <div className='komz-chart-column' key={`column-${i}`} />
            )}
            {statsByExec.map((stats, i) => stats.map(stat =>
              <DayBar stat={stat} top={ i*50 } key={stat.id} />
            ))}
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
