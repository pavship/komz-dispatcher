import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'

import { Sidebar, Segment, Card } from 'semantic-ui-react'
import NavBar from './NavBar'
import ExecView from './ExecView'

import { currentUserQuery } from '../graphql/userQueries'

class Main extends Component {
  state = { leftSidebarVisible: false }
  toggleSidebar = () => this.setState({ leftSidebarVisible: !this.state.leftSidebarVisible })
  render() {
    const { leftSidebarVisible } = this.state
    const { user } = this.props
    return (
      <Fragment>
        <NavBar user={user} toggleSidebar={this.toggleSidebar}/>
        <ExecView leftSidebarVisible={leftSidebarVisible} />
      </Fragment>
    )
  }
}

// export default Main
export default compose(
    graphql(
        currentUserQuery,
        {
            props: ({ data }) => ({
              user: data.currentUser,
              loading: data.loading
            }),
            options: {
                fetchPolicy: 'cache-and-network',
            }
        }
    ),
)(Main);
