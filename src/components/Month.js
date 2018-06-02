import { withRouter } from "react-router-dom"
import React, { Component } from 'react'

import MonthView from './MonthView'

import { isValidDate, toLocalISOString, fromLocalISOString } from '../utils'

class Month extends Component {
  choseMonth = (date) => {
    this.props.history.push(`/month/${toLocalISOString(date).slice(0, 7)}`)
  }
  render() {
    const { match: { params: { month } } } = this.props
    const md = fromLocalISOString(month)
    const date = isValidDate(md) ? md : new Date()
    const from = new Date(date.getFullYear(), date.getMonth(), 1)
    const to = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime() + 1)
    return (
      <MonthView from={from} to={to} choseMonth={this.choseMonth} />
    )
  }
}

export default withRouter(Month)
