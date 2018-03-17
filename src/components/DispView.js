import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Segment, List } from 'semantic-ui-react'
// import ModelList from './ModelList'
// import ExecControlPanel from './ExecControlPanel'

import { allWorks } from '../graphql/workQueries'
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
    const { allWorks: { loading, error, allWorks } } = this.props
    console.log(this.props);
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    return (
      <Segment className='komz-segment'>
        <List divided selection size='medium'>
          {/* {prods.map((prod) => <ProdItem prod={prod} key={prod.id} selectProd={this.props.selectProd}/>)} */}
          {/* {[].concat(allWorks).map((prod) => <List.Item content={prod.start} key={prod.id} />)} */}
          {allWorks && allWorks.map((prod) => <List.Item content={prod.start} key={prod.id} />)}
        </List>
      </Segment>
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
                // updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                //   console.log(prev);
                //   console.log(newWork);
                //   const newD = {
                //     // ...prev,
                //     allWorks: [newWork, ...prev.allWorks.filter(work => work.id !== newWork.id)]
                //     // allWorks: {
                //     //   // ...prev.allWorks,
                //     //   allWorks: [newWork, ...prev.allWorks.filter(work => work.id !== newWork.id)],
                //     //   __typename: 'Work'
                //     // }
                //   }
                //   console.log(newD);
                //   return newD
                // }
              })
            })
        }
    ),
)(DispView)
