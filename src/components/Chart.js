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
  handleDayChange = (day) => {
    this.setState({ selectedDay: day })
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
            { widgetList.map(work => (
              <div className='komz-chart-widget' key={work.id}>
                <Header>{work.execName}</Header>
                { (!work.fin) &&
                  // <Label empty circular className='komz-wt-main' />
                  <Icon name='setting' loading />
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
                fetchPolicy: 'cache-and-network',
            },
            props: props => {
              // console.log(props.chartWorks);
              return {
              chartWorks: props.chartWorks,
              subscribeToWorks: () => props.chartWorks.subscribeToMore({
                document: newWork,
                updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                  // only push newWork if it started not earlier than today
                  // console.log('newWork > ', newWork, (Date.parse(newWork.start) > DateTime.local().startOf('day').ts));
                  console.log(prev);
                  if (Date.parse(newWork.start) > DateTime.local().startOf('day').ts) {
                    return {
                      chartWorks: [...prev.chartWorks.filter(work => work.id !== newWork.id), newWork]
                    }
                  } else {
                    return { chartWorks: prev.chartWorks }
                  }
                }
              })
            }}
        }
    ),
)(Chart)
