import React, {Component} from 'react'
import {Auth} from "aws-amplify"
import { Menu, Icon } from 'semantic-ui-react'

export default class NavBar extends Component {
  signOut = () => {
    Auth.signOut()
    window.location.reload()
  }
  render() {
    const { user } = this.props
    return (
      <Menu icon inverted className='komz-navbar' size='small'>
        {/* <Menu.Menu>
            <Menu.Item name='bars' onClick={toggleSidebar}>
            </Menu.Item>
        </Menu.Menu> */}
        <Menu.Menu position='right'>
          <Menu.Item name={user.name} />
          <Menu.Item name='sign out' onClick={this.signOut}>
            <Icon name='sign out' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
