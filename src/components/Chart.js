import _ from 'lodash'
import { DateTime } from 'luxon'
import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Segment, Card, Header, Icon } from 'semantic-ui-react'
import DatePicker from './DatePicker'
import ChartScale from './ChartScale'
import WorkLine from './WorkLine'
import ExecCard from './ExecCard'

// import { allWorks } from '../graphql/workQueries'
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
      // TODO prepare left, param and make WorkBar component stateless
      const sortIndex = (work.workType === 'Прямые') ? 1.0 :
                        (work.workType === 'Косвенные') ? 2.0 :
                        (work.workType === 'Отдых') ? 3.0 :
                        (work.workType === 'Негативные') ? 4.0 : 5.0
      return {
        early,
        late,
        chStart,
        chTime,
        sortIndex,
        ...work,
      }
    })
    // console.log(preparedWorks);
    //filter out running works which run on the day before selected period. Then sort
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
          <ChartScale />
          <DatePicker selectedDay={from} chosePeriod={chosePeriod} />
          <div className='komz-chart-widget-list'>
            { widgetList.map(({ id, execName, fin, workType, workSubType, models }) => (
              <div className='komz-chart-widget' key={id}>
                <Header>
                  {execName}
                  <Header.Subheader className={fin && 'komz-red'}>
                    {!fin ? (workSubType || workType) : 'Не регистрируется'}
                  </Header.Subheader>
                </Header>
                { (!fin) &&
                  <Icon name='setting' loading />
                }
                { models &&
                  <Header size='huge' sub floated='right' className='komz-disp-widget-model'>
                    {models[0].name}
                    { models[0].prods.length > 1 && ` (${models[0].prods.length}шт.)`}
                  </Header>
                }
              </div>
            )) }
          </div>
          <div className='komz-chart'>
            <WorkLine chartFrom={from} execWorks={chartWorksPerExec} />
            {[...Array(23)].map((x, i) =>
              <div className='komz-chart-section' key={i} />
            )}
          </div>
        </div>
        <Segment className='komz-no-margin' >
          <Card.Group>
            {/* <ExecCard /> */}
            { cardWorksPerExec.map((works, i) => <ExecCard works={works} key={i}/>) }
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
                // fetchPolicy: 'cache-and-network',
                fetchPolicy: 'network-only',
            },
            props: ({ chartWorks, ownProps }) => {
              console.log(ownProps)
              const p = { ...ownProps }
              return {
                chartWorks: chartWorks,
                subscribeToWorks: () => {
                  console.log('subscribeToWorks > ownProps > ', ownProps)
                  return chartWorks.subscribeToMore({
                  document: newWork,
                  // fetchPolicy: 'network-only',
                  // fetchPolicy: 'no-cache',
                  updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                    // only push newWork if it fits selected chart period
                    console.log('updateQuery > newWork > ', newWork);
                    console.log('updateQuery > ownProps > ', ownProps);
                    console.log('updateQuery > p > ', p);
                    const start = DateTime.fromISO(newWork.start).ts
                    const fin = newWork.fin ? DateTime.fromISO(newWork.fin).ts : null
                    const queryFrom = ownProps.queryFrom.getTime()
                    const from = ownProps.from.getTime()
                    const to = ownProps.to.getTime()
                    console.log(start, fin, queryFrom, ownProps.queryFrom, from, ownProps.from, to, ownProps.to );
                    if (!(queryFrom < start && start < to && (!fin || (from < fin)))) return { chartWorks: prev.chartWorks }
                    console.log(start, fin, queryFrom, from, to);
                    const filteredWorks = prev.chartWorks.filter(work => work.id !== newWork.id)
                    if (newWork.deleted) return { chartWorks: filteredWorks }
                    return { chartWorks: [...filteredWorks, newWork] }
                    // if (ownProps.from.getTime() === DateTime.local().startOf('day').ts) {
                    // } else {
                    //   return { chartWorks: prev.chartWorks }
                    // }
                  }
                })}
              }
            }
        }
    ),
)(Chart)
