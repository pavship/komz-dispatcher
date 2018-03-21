import React, { Component } from 'react'
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
    const { work: { fin } } = this.props
    if (!this.finished) {
      this.tick()
      this.start()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.work.fin && (this.props.work.fin === null)) {
      this.stop()
      const width = Math.round(Interval.fromDateTimes(DateTime.fromISO(this.props.work.start), DateTime.fromISO(nextProps.work.fin)).length('minute'))
      this.setState({ width })
    }
  }
  componentWillUnmount() {
    if (this.timer) this.stop()
  }
  tick = () => {
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
    this.timer = setInterval(() => { this.tick() }, 60000)
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

export default WorkBar
