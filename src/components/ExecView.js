import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Item, Sidebar, Segment, Card } from 'semantic-ui-react'
import ModelList from './ModelList'

import deptModelsQuery from '../graphql/deptModelsQuery'

class ExecView extends Component {
  toggleSidebar = () => this.setState({ visible: !this.state.visible })
  render() {
    const { leftSidebarVisible, deptModelsQuery: { loading, networkStatus, error, deptModels } } = this.props
    return (
        <Sidebar.Pushable as={Segment} className='komz-pushable'>
          <Sidebar as={Card} animation='overlay' visible={leftSidebarVisible} className='komz-sidebar'>
            {
              (loading) ? <div>Загрузка...</div> :
              (error) ? <div>Ошибка получения данных.</div> :
              <ModelList deptModels={deptModels} />
            }
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Item.Header as='a'>Followup Article</Item.Header>
              <Item.Meta>By Author</Item.Meta>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
  }
}

export default compose(
    graphql(
        deptModelsQuery,
        {
            name: 'deptModelsQuery',
            options: {
                fetchPolicy: 'cache-and-network',
            }
        }
    ),
)(ExecView);
