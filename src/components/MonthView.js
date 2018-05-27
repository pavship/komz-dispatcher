import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { graphql } from "react-apollo"

import { Segment, Card, Header } from 'semantic-ui-react'
import DatePicker from './DatePicker'
import ChartScale from './ChartScale'
import DayBar from './DayBar'
import ExecCard from './ExecCard'

import { wtSortRule } from '../constants'
import { dayStats } from '../graphql/statQueries'

class MonthView extends Component {
  render() {
    const { from, choseMonth, dayStats: { loading, error, dayStats } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    const year = from.getFullYear()
    const month = from.getMonth()
    // convert milliseconds into hours with 2 digits after dot precision
    const msToHours = (ms) => Math.round(ms / 3600000 * 100) / 100
    const preparedStats = dayStats.map(stat => ({
      ...stat,
      time: msToHours(stat.time),
      workTypes: _.sortBy(stat.workTypes, [function (wt) { return wtSortRule.indexOf(wt.workType); }]).map(workType => ({
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
            }))
          }))
        }))
      }))
    }))
    const statsByExec = _(preparedStats).sortBy('execName').groupBy('execName').reduce(function (result, value, key) {
      result.push(value)
      return result
    }, [])
    // console.log(statsByExec);
    const aggregateTime = (stats) => Math.round(stats.reduce((sum, stat) => sum += stat.time, 0) * 100) / 100
    // following function returns lodash object for chaining
    const aggregateAndGroupItems = (xs, key, gKey) => _(xs.reduce((rv, x) => [...rv, ...x[key]], [])).groupBy(gKey || key)
    const monthStats = statsByExec.map(stats => ({
      execName: stats[0].execName,
      time: aggregateTime(stats),
      workTypes: aggregateAndGroupItems(stats, 'workTypes', 'workType').reduce(
        function (workTypes, stats, workType) {
          workTypes.push({
            workType,
            time: aggregateTime(stats),
            workTypeClass: stats[0].workTypeClass,
            workSubTypes: aggregateAndGroupItems(stats, 'workSubTypes', 'workSubType').reduce(
              function (workSubTypes, stats, workSubType) {
                workSubTypes.push({
                  workSubType,
                  time: aggregateTime(stats),
                  models: aggregateAndGroupItems(stats, 'models', 'article').reduce(
                    function (models, stats, article) {
                      models.push({
                        name: stats[0].name,
                        article,
                        time: aggregateTime(stats),
                        prods: aggregateAndGroupItems(stats, 'prods', 'id').reduce(
                          function (prods, stats, id) {
                            prods.push({
                              id,
                              fullnumber: stats[0].fullnumber,
                              time: aggregateTime(stats),
                            })
                            return prods
                          }, []
                        )
                      })
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
    }))
    // console.log(monthStats)
    return (
      <Fragment>
        <div className='komz-no-margin komz-disp-month-grid'>
          <ChartScale chartType='month' monthDate={from} />
          <DatePicker selectedDay={from} chosePeriod={choseMonth} />
          <div className='komz-chart-widget-area'>
            {monthStats.map((stat, i) => {
              const { execName, time } = stat
              return (
                <div className='komz-chart-widget komz-month-chart-widget' key={execName}>
                  <Header className='komz-flex-item-right' style={{ width: 200 }}>
                    {execName}
                    <Header.Subheader className='komz-float-right'>
                      {`${time}ч`}
                    </Header.Subheader>
                    <div style={{ height: 10, borderBottom: '1px solid grey', width: 1455 }}></div>
                  </Header>
                </div>
              )
            })}
          </div>
          <div className='komz-chart komz-month-chart'>
            {[...Array(31)].map((x, i) => {
              const weekend = [5, 6].indexOf(new Date(year, month, i).getDay()) >= 0
              return <div className={`komz-chart-column ${weekend && 'komz-chart-column-weekend'}`} key={`column-${i}`} />
            })}
            {statsByExec.map((stats, i) => stats.map(stat =>
              <DayBar stat={stat} top={i * 50} key={stat.id} />
            ))}
          </div>
        </div>
        <Segment className='komz-no-margin komz-disp-cards-segment' >
          <Card.Group>
            {monthStats.map((stat) => <ExecCard dayStat={stat} key={stat.execName} />)}
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
