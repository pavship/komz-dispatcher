import React, { Fragment } from 'react'
import Main from './components/Main'

import appSyncConfig from "./AppSync"
import { ApolloProvider } from "react-apollo"
import { defaultDataIdFromObject } from "apollo-cache-inmemory"
import AWSAppSyncClient from "aws-appsync"
import { Rehydrated } from "aws-appsync-react"
import Amplify, { I18n, Auth } from "aws-amplify"
import { withAuthenticator } from "aws-amplify-react"

const App = ({ client }) => {
  client.cache.reset()
  // client.resetStore()
  // console.log(client);

  return (
    <Fragment>
      <Main />
    </Fragment>
  )
}

I18n.putVocabularies({
  'ru': {
    'Sign In Account': "Войдите в систему",
    'Username': "Логин",
    'Password': "Пароль",
    'Sign In': "Вход"
  }
})

I18n.setLanguage('ru')

Amplify.configure({
  Auth: {
    // identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_AUTH_REGION, // REQUIRED - Amazon Cognito Region
    userPoolId: process.env.REACT_APP_USER_POOL_ID, //OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: process.env.REACT_APP_CLIENT_APP_ID //User Pool App Client ID
  }
});

// Apollo - AppSync client
const config = {
  url: appSyncConfig.graphqlEndpoint,
  region: 'eu-west-1',
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken()
  },
  cacheOptions: {
    dataIdFromObject: object => {
      switch (object.__typename) {
        case 'Prod': return `Prod:${(object.id).slice(-25)}`; // Prod id from DynamoDB ProdTable is in the form of <modelId>-<prodId>. Use only prodId for Apollo cache.
        default: return defaultDataIdFromObject(object); // fall back to default handling
      }
    }
  }
}
// addTypename: false,
// disableOffline: true,
const options = {
  defaultOptions: {
    query: {
      // fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'cache-only',
      fetchPolicy: 'network-only',
    }
  }
}
const client = new AWSAppSyncClient(config, options)

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App client={client} />
    </Rehydrated>
  </ApolloProvider>
)

export default withAuthenticator(WithProvider, false)