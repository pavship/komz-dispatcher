import React, { Component } from 'react'

class WorkBar extends Component {
  state = {
    timer: null,
    width: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1
  }
  componentDidMount() {
      this.start()
  }
  componentWillUnmount() {
      if (this.state.timer) this.stop()
  }
  tick = () => {
    // this.setState({width: new Date().toLocaleString()})
    let time = Math.round((new Date() - Date.parse(this.props.work.start))/1000, 0)
    if (time >= 1440) {
      this.stop()
      time = 1440
      this.setState({borderRightWidth: 0})
    }
    this.setState({width: time})
  }
  start = () => {
    this.setState({timer: setInterval(() => { this.tick() }, 1000)})
  }
  stop = () => clearInterval(this.state.timer)
  render() {
    const { width, borderLeftWidth, borderRightWidth } = this.state
    const { work } = this.props
    return (
      <div className='komz-workbar' style={{width, borderLeftWidth, borderRightWidth}} >({width}), end{work.end}</div>
    )
  }
}

export default WorkBar
