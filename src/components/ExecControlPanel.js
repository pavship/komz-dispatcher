import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
import { DateTime } from 'luxon'

import { Container, Segment, Button, Icon, Label } from 'semantic-ui-react'

import { getCurWork } from '../graphql/workQueries'
import { createWork } from '../graphql/workQueries'
import { finishWork } from '../graphql/workQueries'

class ExecControlPanel extends Component {
  state = {
    timer: null,
    time: 0
  }
  timer1
  componentDidMount() {
      this.timer1 = setInterval(() => {
        if (this.props.getCurWork && this.props.getCurWork.getCurWork) {
          const { start, fin } = this.props.getCurWork.getCurWork
          if (!fin) this.setState({time: Math.round((new Date() - Date.parse(start))/1000)})
          else this.setState({time: Math.round((Date.parse(fin) - Date.parse(start))/1000)})
        }
      }, 1000)
  }
  componentWillUnmount() {
      clearInterval(this.timer1)
  }
  tick = () => {
    const { start } = this.props.getCurWork.getCurWork
    this.setState({time: Math.round((new Date() - Date.parse(start))/1000)})
  }
  start = () => {
    // this.setState({timer: setInterval(() => { this.tick() }, 1000)})
    this.createWork()
  }
  // stop = () => clearInterval(this.state.timer)
  createWork = () => {
    const start = new Date()
    // const start = DateTime.local().startOf('day').toJSDate()
    const { createWork } = this.props
    createWork({ variables: { start } })
    .then((obj) => {
      console.log(obj)
      // console.log(this.props.getCurWork);
      this.props.getCurWork.refetch()
    })
  }
  finishWork = () => {
    // this.stop()
    const { id, start } = this.props.getCurWork.getCurWork
    const fin = new Date()
    const time = Math.round((fin - Date.parse(start))/1000)
    this.props.finishWork({
      variables: { id, time, fin }
    })
  }
  render() {
    const { getCurWork: {loading, error, getCurWork} } = this.props
    const { time } = this.state
    return (
      <Fragment>
        {
          loading ? 'Загрузка' :
          error ? 'Ошибка' :
          <Segment basic className='komz-no-margin'>
            CurWork:  {getCurWork.id}<br/>
            start: {getCurWork.start}<br/>
            fin: {getCurWork.fin}
          </Segment>
        }
        <Segment basic className='komz-no-margin'>
          <Button as='div' labelPosition='right'>
            <Button primary onClick={this.start}>
              <Icon name='play' />
              Play
            </Button>
            <Label as='a' basic pointing='left'>{time}</Label>
          </Button>
        </Segment>
        <Segment basic className='komz-no-margin'>
          <Button as='div' onClick={this.finishWork}>
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
        getCurWork,
        {
            name: 'getCurWork'
        }
    ),
    graphql(
        createWork,
        {
            name: 'createWork',
            options: {
              refetchQueries: ['getCurWork']
            }
        }
    ),
    graphql(
        finishWork,
        {
            name: 'finishWork'
        }
    ),
)(ExecControlPanel);
