import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
import { DateTime } from 'luxon'

import { Segment, List } from 'semantic-ui-react'
import WorkLine from './WorkLine'
import ChartScale from './ChartScale'

import { allWorks } from '../graphql/workQueries'
import { chartWorks } from '../graphql/workQueries'
import { newWork } from '../graphql/workQueries'

class DispView extends Component {
  subscription
  componentDidMount() {
      this.subscription = this.props.subscribeToWorks()
  }
  componentWillUnmount() {
      this.subscription()
  }
  render() {
    // const { allWorks: { loading, error, allWorks } } = this.props
    const { chartWorks: { loading, error, chartWorks } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    return (
      <div className='komz-no-margin komz-dispacher-grid'>
        <ChartScale date='2018-03-19'/>
        <div className='komz-chart'>
          <WorkLine works={chartWorks} />
          {/* <WorkLine className='komz-workline' works={chartWorks} /> */}
          {[...Array(23)].map((x, i) =>
            <div className='komz-chart-section' key={i} />
          )}
        </div>
      </div>
    )
  }
}

// export default DispView
export default compose(
    graphql(
        allWorks,
        {
            name: 'allWorks',
            options: {
                fetchPolicy: 'cache-and-network',
            },
            props: props => ({
              // ...props
              allWorks: props.allWorks,
              subscribeToWorks: () => props.allWorks.subscribeToMore({
                document: newWork,
                updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                  return {
                    allWorks: [newWork, ...prev.allWorks.filter(work => work.id !== newWork.id)]
                  }
                }
              })
            })
        }
    ),
    graphql(
        chartWorks,
        {
            name: 'chartWorks',
            options: {
                fetchPolicy: 'cache-and-network',
            },
            props: props => ({
              // ...props
              chartWorks: props.chartWorks,
              subscribeToWorks: () => props.chartWorks.subscribeToMore({
                document: newWork,
                updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                  // only push newWork if it started not earlier than today
                  console.log('newWork > ', newWork, (Date.parse(newWork.start) > DateTime.local().startOf('day').ts));
                  if (Date.parse(newWork.start) > DateTime.local().startOf('day').ts) {
                    return {
                      chartWorks: [newWork, ...prev.chartWorks.filter(work => work.id !== newWork.id)]
                    }
                  } else {
                    return { chartWorks: prev.chartWorks }
                  }
                }
              })
            })
        }
    ),
)(DispView)
