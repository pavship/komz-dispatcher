import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'

import { Sidebar, Segment, Card } from 'semantic-ui-react'
import NavBar from './NavBar'
import ExecView from './ExecView'
import DispView from './DispView'

import { currentUser } from '../graphql/userQueries'

class Main extends Component {
  state = { leftSidebarVisible: false }
  toggleSidebar = () => this.setState({ leftSidebarVisible: !this.state.leftSidebarVisible })
  render() {
    const { leftSidebarVisible } = this.state
    const { currentUser: { loading, error, currentUser } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    return (
      <Fragment>
        <NavBar user={currentUser} toggleSidebar={this.toggleSidebar}/>
        { currentUser.isDisp ?
          <DispView view='view'/> :
          <ExecView sidebarVisible={leftSidebarVisible} />
        }
      </Fragment>
    )
  }
}

// export default Main
export default compose(
    graphql(
        currentUser,
        {
            // props: ({ data }) => ({
            //   user: data.currentUser,
            //   loading: data.loading
            // }),
            name: 'currentUser',
            options: {
                fetchPolicy: 'cache-and-network',
            }
        }
    ),
)(Main);
