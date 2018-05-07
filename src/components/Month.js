import React, { Component } from 'react'

import MonthView from './MonthView'

class Month extends Component {
  state = {
    month: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  }
  render() {
    return (
      <MonthView month={this.state.month} />
    )
  }
}

export default Month
