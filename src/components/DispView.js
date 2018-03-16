import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Segment, List } from 'semantic-ui-react'
// import ModelList from './ModelList'
// import ExecControlPanel from './ExecControlPanel'

import { allWorks } from '../graphql/workQueries'

class DispView extends Component {
  render() {
    const { allWorks: { loading, error, allWorks } } = this.props
    return (
        <Segment className='komz-segment'>
          <List divided selection size='medium'>
            {/* {prods.map((prod) => <ProdItem prod={prod} key={prod.id} selectProd={this.props.selectProd}/>)} */}
            {allWorks.map((prod) => <List.Item content={prod.start} key={prod.id} />)}
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
            }
        }
    ),
)(DispView)
