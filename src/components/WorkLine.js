import React, { Component } from 'react'

import { List } from 'semantic-ui-react'
import WorkBar from './WorkBar'

class WorkLine extends Component {
  render() {
    const { works } = this.props
    return (
      <List.Item>
        {/* {works.map((work) => <List.Item content={work.start} key={work.id} />)} */}
        {works.map((work) => (
          <WorkBar work={work} key={work.id} />
        ))}
      </List.Item>
    )
  }
}

export default WorkLine
