import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'
import { Grid, Item } from 'semantic-ui-react'
import deptModelsQuery from '../graphql/deptModelsQuery'

import NavBar from './NavBar'
import ModelList from './ModelList'

const Main = ({deptModelsQuery: { loading, networkStatus, error, deptModels }}) => (
    <Fragment>
      <NavBar></NavBar>
      <Grid columns={2} divided>
        <Grid.Column>
          {
            (loading) ? <div>Загрузка...</div> :
            (error) ? <div>Ошибка получения данных.</div> :
            <ModelList deptModels={deptModels} />
          }
        </Grid.Column>
        <Grid.Column>
          <Item.Header as='a'>Followup Article</Item.Header>
          <Item.Meta>By Author</Item.Meta>
        </Grid.Column>
      </Grid>
    </Fragment>
  )

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
