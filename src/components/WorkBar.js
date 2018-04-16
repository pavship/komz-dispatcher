import { DateTime, Interval } from 'luxon'
import React, { Component } from 'react'

import { Popup, Accordion, List, Header, Icon, Divider, Button } from 'semantic-ui-react'

import WorkPopup from './WorkPopup'

class WorkBar extends Component {
  timer
  startsEarlier = (Date.parse(this.props.work.start) < this.props.chartFrom.getTime())
  finished = !!this.props.work.fin
  finishesLater = this.finished ? (DateTime.fromJSDate(this.props.chartFrom).endOf('day').ts < Date.parse(this.props.work.fin)) : false
  state = {
    top: this.props.top,
    left: this.startsEarlier ? 0 : Math.round(Interval.fromDateTimes(DateTime.fromJSDate(this.props.chartFrom), DateTime.fromISO(this.props.work.start)).length('minute')),
    width: (this.startsEarlier && this.finished && this.finishesLater) ? 1440 :
      (this.startsEarlier && this.finished) ? Math.round(Interval.fromDateTimes(DateTime.fromJSDate(this.props.chartFrom), DateTime.fromISO(this.props.work.fin)).length('minute')) :
      (this.finishesLater) ? Math.round(Interval.fromDateTimes(DateTime.fromISO(this.props.work.start), DateTime.fromJSDate(this.props.chartFrom).endOf('day')).length('minute'))
      : Math.round(this.props.work.time/60),
    borderLeftWidth: this.startsEarlier ? 0 : 1,
    borderRightWidth: this.finishesLater ? 0: 1
  }
  componentDidMount() {
    if (!this.finished) {
      this.tick()
      this.start()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.work.fin && (this.props.work.fin === null)) {
      this.stop()
      const width = this.startsEarlier ? Math.round(Interval.fromDateTimes(DateTime.fromJSDate(this.props.chartFrom), DateTime.fromISO(nextProps.work.fin)).length('minute')) : Math.round(nextProps.work.time/60)
      this.setState({ width })
    }
  }
  componentWillUnmount() {
    if (this.timer) this.stop()
  }
  tick = () => {
    const finishesLater = (DateTime.fromJSDate(this.props.chartFrom).endOf('day').ts < Date.parse(new Date()))
    let width
    if (finishesLater) {
      this.stop()
      width = this.startsEarlier ? 1440 : Math.round(Interval.fromDateTimes(DateTime.fromISO(this.props.work.start), DateTime.fromJSDate(this.props.chartFrom).endOf('day')).length('minute'))
      this.setState({borderRightWidth: 0})
    } else {
      width = this.startsEarlier ? Math.round(Interval.fromDateTimes(DateTime.fromJSDate(this.props.chartFrom), DateTime.local()).length('minute')) : Math.round(Interval.fromDateTimes(DateTime.fromISO(this.props.work.start), DateTime.local()).length('minute'))
    }
    this.setState({ width })
  }
  start = () => {
    this.timer = setInterval(() => { this.tick() }, 60000)
  }
  stop = () => clearInterval(this.timer)
  render() {
    const { top, left, width, borderLeftWidth, borderRightWidth } = this.state
    const { work } = this.props
    const wt = work.workType
    const workTypeClass = (wt === 'Прямые') ? 'main' :
                          (wt === 'Косвенные') ? 'aux' :
                          (wt === 'Побочные') ? 'aside' :
                          (wt === 'Отдых') ? 'rest' : 'negative'
    return (
      <WorkPopup work={work}>
        <div className={`komz-workbar komz-${workTypeClass}`}
          style={{top, left, width, borderLeftWidth, borderRightWidth}}
        ></div>
      </WorkPopup>
    )
  }
}

export default WorkBar
