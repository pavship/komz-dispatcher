import _ from 'lodash'
import { DateTime } from 'luxon'
import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Segment, Card, Header, Icon } from 'semantic-ui-react'

import DatePicker from './DatePicker'
import ChartScale from './ChartScale'
import WorkLine from './WorkLine'
import ExecCardWithDataPrep from './ExecCardWithDataPrep'

import { wtSortRule } from '../constants'

import { chartWorks } from '../graphql/workQueries'
import { newWork } from '../graphql/workQueries'

class Chart extends Component {
  subscription
  componentDidMount() {
      this.subscription = this.props.subscribeToWorks()
  }
  componentWillUnmount() {
      this.subscription()
  }
  state = {
    selectedDay: new Date()
  }
  componentWillReceiveProps(nextProps) {
    // console.log('received props', nextProps);
  }
  render() {
    const { from, to, chosePeriod, chartWorks: { loading, error, chartWorks } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    // console.log(chartWorks);
    // dates in epoch format
    const from_ep = from.getTime()
    const to_ep = to.getTime()
    // prepare elements
    const preparedWorks = chartWorks.map(work => {
      // dates in epoch format
      // const from_ep = from.getTime()
      // const to_ep = to.getTime()
      const start_ep = Date.parse(work.start)
      const fin_ep = Date.parse(work.fin) || null // returns NaN if work.fin is null (it's OK)
      // labels in case work starts before chart period or finishes later
      const early = start_ep < from_ep
      const late = to_ep < fin_ep || (!work.fin && to.getTime() < Date.now()) // (to_ep < fin_ep) returns false if fin_ep is NaN (it's OK)
      // start, finish and time on the chart
      const chStart = early ? from_ep : start_ep
      const chFin = late ? to_ep + 1 : fin_ep
      const chTime = chFin ? chFin - chStart : null // chTime is Null only for live works (running within chart's time boundaries)
      const chLeft = Math.round( (chStart - from_ep)/60000 )
      // TODO prepare other workBar params and make WorkBar component stateless
      // sort Index to sort workTypes to be displayed in order according to settings placed into wtSortRule constant
      const sortIndex = wtSortRule.indexOf(work.workType)
      return {
        early,
        late,
        chLeft,
        chStart,
        chTime,
        sortIndex,
        ...work,
      }
    })
    // console.log(preparedWorks);
    //filter out running works when selected period is any further than today. Then sort
    const chartWorksByExec = _.sortBy(preparedWorks.filter(work => !(!work.fin && _.now() < from_ep)), 'execName')
    // console.log(chartWorksByExec)
    const chartWorksPerExec = _.reduce(_.groupBy(chartWorksByExec, 'execName'), function(result, value, key) {
      result.push(value)
      return result
    }, [])
    // console.log(chartWorksPerExec)

    // widgetList contains 1 work per exec. Currently running works prevail
    const execList = _.uniqBy(chartWorksByExec, 'execName')
    // console.log(execList)
    const worksInProgress = _.filter(chartWorksByExec, {'fin': null})
    // console.log(worksInProgress)
    const widgetList = _.sortBy(_.uniqBy(_.concat(worksInProgress, execList), 'execName'), 'execName')
    // console.log(widgetList)

    const cardWorksPerExec = _(chartWorksByExec).groupBy('execName').reduce(
      function(result, value, key) {
        result.push(value)
        return result
    }, [])
    // console.log(cardWorksPerExec);
    return (
      <Fragment>
        <div className='komz-no-margin komz-dispacher-grid'>
          <ChartScale chartType='day'/>
          <DatePicker selectedDay={from} chosePeriod={chosePeriod} />
          <div className='komz-chart-widget-area'>
            { widgetList.map(({ id, execName, fin, workType, workSubType, models }) => (
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
                  <Header size='huge' sub floated='right' className='komz-flex-item-right'>
                    {models[0].name}
                    { models[0].prods.length > 1 && ` (${models[0].prods.length}шт.)`}
                  </Header>
                }
              </div>
            )) }
          </div>
          <div className='komz-chart komz-day-chart'>
            <WorkLine chartFrom={from} execWorks={chartWorksPerExec} />
            {[...Array(23)].map((x, i) =>
              <div className='komz-chart-column' key={i} />
            )}
          </div>
        </div>
        <Segment className='komz-no-margin komz-disp-cards-segment' >
          <Card.Group>
            { cardWorksPerExec.map((works, i) => <ExecCardWithDataPrep works={works} key={i}/>) }
          </Card.Group>
        </Segment>
      </Fragment>
    )
  }
}

// export default Chart
export default compose(
    graphql(
        chartWorks,
        {
            name: 'chartWorks',
            options: {
                fetchPolicy: 'cache-and-network',
            },
            props: ({ chartWorks, ownProps }) => {
              return {
                chartWorks: chartWorks,
                subscribeToWorks: () => {
                  return chartWorks.subscribeToMore({
                    document: newWork,
                    updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                      const chartWorks = prev.chartWorks
                      // filter old works from chartWorks
                      const filteredWorks = chartWorks.filter(work => work.id !== (newWork.deleted || newWork.id))
                      // if the work was deleted return filteredWorks
                      if (newWork.deleted === newWork.id) return { chartWorks: filteredWorks }
                      // otherwise, substitute or add newWork
                      return { chartWorks: [...filteredWorks, newWork] }
                      // TODO implementation above should check that newWork fits
                      // selected chart time period (is between ownProps.from and ownProps.to),
                      // but ownProps aren't equal Chart's props (Apollo bug) and
                      // we're waiting until apollo fixes this issue
                      // https://github.com/apollographql/react-apollo/issues/1958
                    }
                  })
                }
              }
            }
        }
    ),
)(Chart)
