import React, {Component} from 'react'
import {Auth} from "aws-amplify"
import { Menu, Icon, Label } from 'semantic-ui-react'

export default class NavBar extends Component {
  state = { activeItem: 'home' }
  signOut = () => {
    Auth.signOut()
    window.location.reload()
  }
  render() {
    const { activeItem } = this.state
    const { user, toggleSidebar } = this.props
    return (
      <Menu icon inverted className='komz-navbar'>
        <Menu.Menu>
          <Menu.Item name='bars' onClick={toggleSidebar}>
            В работе
            <Label color='grey'>0</Label>
          </Menu.Item>
        </Menu.Menu>
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
