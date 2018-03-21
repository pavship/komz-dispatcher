import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
import { DateTime } from 'luxon'

import { Container, Segment, Button, Icon, Label, Progress } from 'semantic-ui-react'

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
        <Segment basic className='komz-exec-status-bar'>
          <b>6:00/9:00 | </b>
          <Label empty circular className='komz-wt-main' />
          <Label empty circular className='komz-wt-aux' />
          <Label empty circular className='komz-wt-aside' />
          <b>5:00/7:45 | </b>
          <Label empty circular className='komz-wt-rest' />
          <b>1:00/1:15</b>
          <Progress percent={66} color='black' active attached='bottom' />
        </Segment>
        <div className='komz-exec-grid'>
          <div className='komz-exec-col-left'>
            <div className='komz-exec-button-container komz-wt-aside'>
              <Button className='komz-exec-button' fluid size='small'>Побочная активность</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-rest'>
              <Button className='komz-exec-button' fluid size='small'>Отдых/обед</Button>
            </div>
             <div className='komz-exec-button-container komz-wt-danger'>
               <Button className='komz-exec-button' fluid size='small'>Простой</Button>
             </div>
             <div className='komz-exec-button-container komz-wt-danger'>
               <Button className='komz-exec-button' fluid size='small'>SOS</Button>
             </div>
          </div>
          <div className='komz-exec-col-right'>
            <div className='komz-exec-button-container komz-wt-main'>
              <Button className='komz-exec-button' fluid size='small'>Фрезерование/Наладка</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-main'>
              <Button className='komz-exec-button' fluid size='small'>Погрузка/Разгрузка</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-main'>
              <Button className='komz-exec-button' fluid size='small'>Консервация/<br />(Рас/У)паковка</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-aux'>
              <Button className='komz-exec-button' fluid size='small'>ТО оборудования</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-aux'>
              <Button className='komz-exec-button' fluid size='small'>Другие вспомогательные</Button>
            </div>
          </div>
        </div>
      </Fragment>
      // <Fragment>
      //   {
      //     loading ? 'Загрузка' :
      //     error ? 'Ошибка' :
      //     <Segment basic className='komz-no-margin'>
      //       CurWork:  {getCurWork.id}<br/>
      //       start: {getCurWork.start}<br/>
      //       fin: {getCurWork.fin}
      //     </Segment>
      //   }
      //   <Segment basic className='komz-no-margin'>
      //     <Button as='div' labelPosition='right'>
      //       <Button primary onClick={this.start}>
      //         <Icon name='play' />
      //         Play
      //       </Button>
      //       <Label as='a' basic pointing='left'>{time}</Label>
      //     </Button>
      //   </Segment>
      //   <Segment basic className='komz-no-margin'>
      //     <Button as='div' onClick={this.finishWork}>
      //       <Icon name='stop' />
      //       Stop
      //     </Button>
      //     <Button as='div' onClick={this.tick}>
      //       <Icon name='lightning' />
      //       Tick
      //     </Button>
      //   </Segment>
      // </Fragment>
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
