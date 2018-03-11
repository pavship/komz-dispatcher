import React, { Component, Fragment } from 'react'
import { Grid, Item } from 'semantic-ui-react'
import NavBar from './components/NavBar'
import ModelList from './components/ModelList'

import appSyncConfig from "./AppSync";
import { ApolloProvider } from "react-apollo";
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";

const App = () => (
    <Fragment>
      <NavBar></NavBar>
      <Grid columns={2} divided>
        <Grid.Column>
          <ModelList></ModelList>
        </Grid.Column>
        <Grid.Column>
          <Item.Header as='a'>Followup Article</Item.Header>
          <Item.Meta>By Author</Item.Meta>
        </Grid.Column>
      </Grid>
    </Fragment>
  )

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: appSyncConfig.authenticationType,
    apiKey: appSyncConfig.apiKey,
  }
})

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
)

export default WithProvider

// export default App;
