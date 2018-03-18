import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Segment, List } from 'semantic-ui-react'
import WorkLine from './WorkLine'

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
        <div className='komz-chart'>
          <WorkLine works={chartWorks} />
        </div>
        {/* <List divided selection size='medium'>
          <WorkLine works={allWorks} />
        </List> */}
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
            // props: props => ({
            //   // ...props
            //   allWorks: props.allWorks,
            //   subscribeToWorks: () => props.allWorks.subscribeToMore({
            //     document: newWork,
            //     updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
            //       return {
            //         allWorks: [newWork, ...prev.allWorks.filter(work => work.id !== newWork.id)]
            //       }
            //     }
            //   })
            // })
        }
    ),
)(DispView)
