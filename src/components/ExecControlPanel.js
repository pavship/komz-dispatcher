import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Container, Segment, Button, Icon, Label } from 'semantic-ui-react'

import { createWork } from '../graphql/workQueries'

class ExecControlPanel extends Component {
  state = {
    timer: null,
    time: new Date().toLocaleString()
  }
  tick = () => {
    this.setState({time: new Date().toLocaleString()})
  }
  start = () => {
    this.setState({timer: setInterval(() => { this.tick() }, 1000)})
    this.createWork(new Date())
  }
  stop = () => clearInterval(this.state.timer)
  createWork = async (start, end) => {
    end = end || null
    console.log(start, end)
    console.log(this.props)
    await this.props.createWork({
      variables: {
        start: start
        // end: 'jhkhjh'
      }
    })
  }
  render() {
    const { time } = this.state
    return (
      <Fragment>
        <Segment basic>
          <Button as='div' labelPosition='right'>
            <Button primary onClick={this.start}>
              <Icon name='play' />
              Play
            </Button>
            <Label as='a' basic pointing='left'>{time}</Label>
          </Button>
        </Segment>
        <Segment basic>
          <Button as='div' onClick={this.stop}>
            <Icon name='stop' />
            Stop
          </Button>
          <Button as='div' onClick={this.tick}>
            <Icon name='lightning' />
            Tick
          </Button>
        </Segment>
      </Fragment>
    )
  }
}

// export default ExecControlPanel

export default compose(
    graphql(
        createWork,
        {
            name: 'createWork'
        }
    ),
)(ExecControlPanel);
