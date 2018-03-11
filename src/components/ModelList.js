import _ from 'lodash'
import React, {Component} from 'react'
import { graphql, compose } from "react-apollo"
import { Item } from 'semantic-ui-react'
// import { Query } from 'react-apollo'
import queryAllModels from '../graphql/queryAllModels'

const ModelList = ({queryAllModels: { loading, networkStatus, error, allModels }}) => {
    if (loading) return <div>Загрузка...</div>
    if (error) return <div>Ошибка получения данных.</div>
    return (
      <Item.Group divided>
       {allModels.map(model => <Item.Header key={model.article}>{model.name}</Item.Header>)}
      </Item.Group>
    )
}

export default compose(
    graphql(
        queryAllModels,
        {
            name: 'queryAllModels',
            options: {
                fetchPolicy: 'cache-and-network',
            }
        }
    )
)(ModelList);
