import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'
import { Grid, Item, Sidebar, Segment, Menu, Icon, Card } from 'semantic-ui-react'
import deptModelsQuery from '../graphql/deptModelsQuery'

import NavBar from './NavBar'
import ModelList from './ModelList'

// const Main = ({deptModelsQuery: { loading, networkStatus, error, deptModels }}) => (
//     <Fragment>
//       <NavBar></NavBar>
//       <Grid columns={2} divided>
//         <Grid.Column>
          // {
          //   (loading) ? <div>Загрузка...</div> :
          //   (error) ? <div>Ошибка получения данных.</div> :
          //   <ModelList deptModels={deptModels} />
          // }
//         </Grid.Column>
//         <Grid.Column>
//           <Item.Header as='a'>Followup Article</Item.Header>
//           <Item.Meta>By Author</Item.Meta>
//         </Grid.Column>
//       </Grid>
//     </Fragment>
//   )
class Main extends Component {
  state = { visible: false }
  toggleSidebar = () => this.setState({ visible: !this.state.visible })
  render() {
    const { visible } = this.state
    const { deptModelsQuery: { loading, networkStatus, error, deptModels } } = this.props
    return (
      <Fragment>
        <NavBar toggleSidebar={this.toggleSidebar}/>
        <Sidebar.Pushable as={Segment} className='komz-pushable'>
          <Sidebar as={Card} animation='overlay' visible={visible} className='komz-sidebar'>
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
      </Fragment>
    )
  }
}
// = ({deptModelsQuery: { loading, networkStatus, error, deptModels }}) =>

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
)(Main);
