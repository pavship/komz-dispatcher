import { withRouter } from "react-router-dom"
import React, { Component } from 'react'

import Chart from './Chart'

import { isValidDate, toLocalISOString, fromLocalISOString } from '../utils'

class DispView extends Component {
  choseDay = (date) => {
    this.props.history.push(`/day/${toLocalISOString(date).slice(0,10)}`)
  }
  render() {
    const { match: { params: { day } } } = this.props
    const d = fromLocalISOString(day)
    const date =  isValidDate(d) ? d : new Date()
    const from = new Date(date.setHours(0,0,0,0))
    const to = new Date(from.getTime() + 24*3600000)
    const queryFrom = new Date(from.getTime() - 24*3600000)
    return (
        <Chart queryFrom={queryFrom} from={from} to={to} choseDay={this.choseDay} />
    )
  }
}

export default withRouter(DispView)
