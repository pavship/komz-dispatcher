import React, { Component } from 'react'

import MonthView from './MonthView'

class Month extends Component {
  state = {
    // month: "2018-05"
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() + 1)
  }
  choseMonth = (month) => {
    this.setState({
      from: new Date(month.getFullYear(), month.getMonth(), 1),
      to: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() + 1)
    })
  }
  render() {
    const { from, to } = this.state
    return (
      <MonthView from={from} to={to} choseMonth={this.choseMonth}/>
    )
  }
}

export default Month
