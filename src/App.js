import React, { Component, Fragment } from 'react'
import { Grid, Item, Button } from 'semantic-ui-react'
import Main from './components/Main'
import ModelList from './components/ModelList'

import appSyncConfig from "./AppSync"
import { ApolloProvider } from "react-apollo"
import AWSAppSyncClient from "aws-appsync"
import { Rehydrated } from "aws-appsync-react"
import Amplify, {Auth} from "aws-amplify"
import { withAuthenticator } from "aws-amplify-react"

const App = () => {
  return (
    <Fragment>
      <Main />
    </Fragment>
  )
}

Amplify.configure({
  Auth: {
    // identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_AUTH_REGION, // REQUIRED - Amazon Cognito Region
    userPoolId: process.env.REACT_APP_USER_POOL_ID, //OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: process.env.REACT_APP_CLIENT_APP_ID //User Pool App Client ID
  }
});

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    // API_KEY
    // type: "API_KEY",
    // apiKey: appSyncConfig.apiKey,
    // IDENTITY User
    // COGNITO USER POOLS
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken()
  }
})

const WithProvider = ({ authState, authData: {username} }) => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App authState={authState} username={username}/>
    </Rehydrated>
  </ApolloProvider>
)

export default withAuthenticator(WithProvider, { includeGreetings: true } )

// export default App;
