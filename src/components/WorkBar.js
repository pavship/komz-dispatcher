import React, { Component } from 'react'
// import moment from 'moment'
import { DateTime, Interval } from 'luxon'

class WorkBar extends Component {
  dt = DateTime.local()
  timer
  startsEarler = (Date.parse(this.props.work.start) < this.dt.startOf('day').ts)
  finished = !!this.props.work.fin
  state = {
    left: this.startsEarler ? 0 : Math.round(Interval.fromDateTimes(this.dt.startOf('day'), DateTime.fromISO(this.props.work.start)).length('minute')),
    width: (this.startsEarler && this.finished) ? Math.round(Interval.fromDateTimes(this.dt.startOf('day'), DateTime.fromISO(this.props.work.fin)).length('minute')) : Math.round(this.props.work.time/60),
    borderLeftWidth: this.startsEarler ? 0 : 1,
    borderRightWidth: 1
  }
  componentDidMount() {
    // console.log(DateTime.fromISO(this.props.work.start).toISO(), this.dt.startOf('day').toISO());
    // console.log(Date.parse(this.props.work.start) < this.dt.startOf('day').ts);
    const { work: { fin } } = this.props
    console.log(this.startsEarler, this.finished, (this.startsEarler && this.finished) ? Math.round(Interval.fromDateTimes(this.dt.startOf('day'), DateTime.fromISO(this.props.work.fin)).length('minute')) : Math.round(this.props.work.time/60));
    if (!this.finished) this.start()
  }
  // componentDidUpdate(prevProps) {
  //   console.log(this.props);
  // }
  componentWillUnmount() {
    if (this.timer) this.stop()
  }
  tick = () => {
    // this.setState({width: new Date().toLocaleString()})
    // let time = Math.round((new Date() - Date.parse(this.props.work.start))/1000)
    const finishesLater = (this.dt.endOf('day').ts < Date.parse(new Date()))
    let width
    if (finishesLater) {
      this.stop()
      width = Math.round(Interval.fromDateTimes(DateTime.fromISO(this.props.work.start), this.dt.endOf('day')).length('minute'))
      this.setState({borderRightWidth: 0})
    } else {
      width = Math.round(Interval.fromDateTimes(DateTime.fromISO(this.props.work.start), new Date()).length('minute'))
    }
    this.setState({ width })
  }
  start = () => {
    this.timer = setInterval(() => { this.tick() }, 1000)
  }
  stop = () => clearInterval(this.timer)
  render() {
    const { left, width, borderLeftWidth, borderRightWidth } = this.state
    const { work } = this.props
    return (
      <div className='komz-workbar'
        style={{left, width, borderLeftWidth, borderRightWidth}}
      ></div>
    )
  }
}
//first variant for seconds:
// class WorkBar extends Component {
//   state = {
//     timer: null,
//     width: 0,
//     borderLeftWidth: 1,
//     borderRightWidth: 1
//   }
//   componentDidMount() {
//       this.start()
//   }
//   componentWillUnmount() {
//       if (this.state.timer) this.stop()
//   }
//   tick = () => {
//     // this.setState({width: new Date().toLocaleString()})
//     let time = Math.round((new Date() - Date.parse(this.props.work.start))/1000)
//     if (time >= 1440) {
//       this.stop()
//       time = 1440
//       this.setState({borderRightWidth: 0})
//     }
//     this.setState({width: time})
//   }
//   start = () => {
//     this.setState({timer: setInterval(() => { this.tick() }, 1000)})
//   }
//   stop = () => clearInterval(this.state.timer)
//   render() {
//     const { width, borderLeftWidth, borderRightWidth } = this.state
//     const { work } = this.props
//     return (
//       <div className='komz-workbar' style={{width, borderLeftWidth, borderRightWidth}} >({width}), end{work.end}</div>
//     )
//   }
// }

export default WorkBar
