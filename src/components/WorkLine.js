import React, { Component } from 'react'

import { List } from 'semantic-ui-react'
import WorkBar from './WorkBar'

class WorkLine extends Component {
  render() {
    const { works, execworks } = this.props
    return (
      // <List.Item>
      <div className='komz-chart-section1' >
        {/* {works.map((work) => (
          <WorkBar work={work} key={work.id} />
        ))} */}
        {execworks.map((works, i) => {
          const top = 50*i
          return works.map((work) => (
            <WorkBar work={work} top={top} key={work.id} />
          ))
        })}
      </div>
      // </List.Item>
    )
  }
}

export default WorkLine
