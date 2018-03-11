import React, {Component} from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export default class NavBar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu icon inverted>
        <Menu.Menu position='right'>
          <Menu.Item name='Савенков В.'/>
          <Menu.Item name='sign out' onClick={this.handleItemClick}>
            <Icon name='sign out' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
