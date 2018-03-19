import React, { Component } from 'react'

import { List } from 'semantic-ui-react'
import WorkBar from './WorkBar'

class WorkLine extends Component {
  render() {
    const { works } = this.props
    return (
      // <List.Item>
      <div className='komz-chart-section1' >
        {works.map((work) => (
          <WorkBar work={work} key={work.id} />
        ))}
      </div>
      // </List.Item>
    )
  }
}

export default WorkLine
