import React, { Component } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'

import NavBar from './NavBar'
import DispView from './DispView'

import { currentUser } from '../graphql/userQueries'

class Main extends Component {
  render() {
    const { currentUser: { loading, error, currentUser } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    return (
      <div className='komz-disp-container' >
        <NavBar user={currentUser} />
        { currentUser.isDisp
          ? <DispView />
          : <div>
              Похоже, Вы не являетесь диспетчером. Панель исполнителя доступна по адресу: <a
              href='https://pavship.github.io/komz-executor'>https://pavship.github.io/komz-executor</a>
            </div>
        }
      </div>
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
