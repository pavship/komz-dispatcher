import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { graphql } from "react-apollo"

import { Segment, Card, Header } from 'semantic-ui-react'
import DatePicker from './DatePicker'
import ChartScale from './ChartScale'
import DayBar from './DayBar'
import ExecCard2 from './ExecCard2'

import { wtSortRule, normatives, wstPrices } from '../constants'
import { toChunks } from '../utils'

import { dayStats } from '../graphql/statQueries'

class MonthView extends Component {
  render() {
    const { from, choseMonth, dayStats: { loading, error, dayStats } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    const year = from.getFullYear()
    const month = from.getMonth()
    // convert milliseconds into hours with 2 digits after dot precision
    const msToHours = (ms) => Math.round(ms / 3600000 * 100) / 100
    // eval work cost
    const evalWorkCost = (hours, price) => (hours * price).toFixed(2)
    const preparedStats = dayStats.map(stat => ({
      ...stat,
      time: msToHours(stat.time),
      workTypes: _.sortBy(stat.workTypes, [function (wt) { return wtSortRule.indexOf(wt.workType); }]).map(workType => ({
        ...workType,
        time: msToHours(workType.time),
        workSubTypes: workType.workSubTypes.map(workSubType => ({
          ...workSubType,
          time: msToHours(workSubType.time),
          models: workSubType.models.map(model => ({
            ...model,
            time: msToHours(model.time),
            prods: model.prods.map(prod => ({
              ...prod,
              time: msToHours(prod.time)
            }))
          }))
        }))
      }))
    }))
    // sort workTypes, add normative work time, evaluate normative work price
    // const preparedStats = dayStats.map(stat => {
    //   let newStat = { ...stat }
    //   let totalNormTime = 0
    //   let totalCost = 0
    //   newStat.time = msToHours(newStat.time)
    //   newStat.workTypes = _.sortBy(newStat.workTypes, [function (wt) { return wtSortRule.indexOf(wt.workType); }]).map(workType => {
    //     let newWorkType = { ...workType }
    //     let wtNormTime = 0
    //     let wtCost = 0
    //     newWorkType.time = msToHours(newWorkType.time)
    //     newWorkType.workSubTypes = newWorkType.workSubTypes.map(workSubType => {
    //       const newWorkSubType = { ...workSubType }
    //       const wstPrice = wstPrices[newWorkSubType.workSubType]
    //       let wstNormTime = 0
    //       newWorkSubType.time = msToHours(newWorkSubType.time)
    //       newWorkSubType.models = newWorkSubType.models.map(model => {
    //         const newModel = { ...model }
    //         // TODO switch to using model.id (add 'model.id' attr into ExecDayStatTable)
    //         const modelNormatives = normatives.find(n => n.name === newModel.name)
    //         const wstNormative = modelNormatives && modelNormatives.workSubTypes.find(wst => wst.name === newWorkSubType.workSubType)
    //         const normative = wstNormative && wstNormative.normative
    //         let modelNormTime = 0
    //         newModel.time = msToHours(newModel.time)
    //         newModel.prods = newModel.prods.map(prod => {
    //           const newProd = { ...prod }
    //           newProd.time = msToHours(newProd.time)
    //           if (normative) {
    //             newProd.nTime = normative
    //             modelNormTime += normative
    //             if (wstPrice) newProd.cost = normative * wstPrice
    //           }
    //           return newProd
    //         })
    //         if (modelNormTime) {
    //           newModel.nTime = modelNormTime
    //           wstNormTime += modelNormTime
    //           if (wstPrice) newModel.cost = modelNormTime * wstPrice
    //         }
    //         return newModel
    //       })
    //       if (wstNormTime) {
    //         newWorkSubType.nTime = wstNormTime
    //         wtNormTime += wstNormTime
    //         if (wstPrice) {
    //           newWorkSubType.cost = wstNormTime * wstPrice
    //           wtCost += newWorkSubType.cost
    //         }
    //       }
    //       return newWorkSubType
    //     })
    //     if (wtNormTime) {
    //       newWorkType.nTime = wtNormTime
    //       totalNormTime += wtNormTime
    //     }
    //     if (wtCost) {
    //       newWorkType.cost = wtCost
    //       totalCost += wtCost
    //     }
    //     return newWorkType
    //   })
    //   if (totalNormTime) newStat.nTime = totalNormTime
    //   if (totalCost) newStat.cost = totalCost
    //   return newStat
    // })
    // console.log('preparedStats > ', preparedStats);
    const statsByExec = _(preparedStats).sortBy('execName').groupBy('execName').reduce(function (result, value, key) {
      result.push(value)
      return result
    }, [])
    // console.log(statsByExec);
    const aggregateTime = (stats) => Math.round(stats.reduce((sum, stat) => sum += stat.time, 0) * 100) / 100
    // const aggregateTime = (stats) => msToHours(stats.reduce((sum, stat) => sum += stat.time, 0))
    // const aggregate = (stats, prop) => stats.reduce((sum, stat) => sum += stat[prop], 0).toFixed(2)
    // const aggregateMultiple = (stats, props) => {
    //   const sums = stats.reduce((sums, stat) => {
    //     sums.map((sum, i) => {
    //       // let sum 
    //       return (props[i] === 'nTime') sum += stat[props[i]] || 0
    //     })
    //   }, Array(props.length).fill(0))
    //   let resultObj = {}
    //   props.forEach((prop, i) => {
    //     if (sums[i]) resultObj[prop] = (prop === 'cost')
    //       ? toChunks(sums[i].toFixed(0).split('').reverse(), 3).map(ch => ch.reverse().join('')).reverse().join(' ')
    //       : sums[i].toFixed(2)
    //   })
    //   return resultObj
    // }
    // following function returns lodash object for chaining
    const aggregateAndGroupItems = (xs, key, gKey) => _(xs.reduce((rv, x) => [...rv, ...x[key]], [])).groupBy(gKey || key)
    const monthStats = statsByExec.map(stats => ({
      execName: stats[0].execName,
      // ...aggregateMultiple(stats, ['time', 'nTime', 'cost']),
      time: aggregateTime(stats),
      workTypes: aggregateAndGroupItems(stats, 'workTypes', 'workType').reduce(
        function (workTypes, stats, workType) {
          workTypes.push({
            workType,
            // ...aggregateMultiple(stats, ['time', 'nTime', 'cost']),
            time: aggregateTime(stats),
            workTypeClass: stats[0].workTypeClass,
            workSubTypes: aggregateAndGroupItems(stats, 'workSubTypes', 'workSubType').reduce(
              function (workSubTypes, stats, workSubType) {
                workSubTypes.push({
                  workSubType,
                  // ...aggregateMultiple(stats, ['time', 'nTime', 'cost']),
                  time: aggregateTime(stats),
                  models: aggregateAndGroupItems(stats, 'models', 'name').reduce(
                    function (models, stats, name) {
                      models.push({
                        name,
                        article: stats[0].article,
                        // ...aggregateMultiple(stats, ['time', 'nTime', 'cost']),
                        time: aggregateTime(stats),
                        prods: aggregateAndGroupItems(stats, 'prods', 'id').reduce(
                          function (prods, stats, id) {
                            prods.push({
                              id,
                              fullnumber: stats[0].fullnumber,
                              time: aggregateTime(stats),
                              // ...((name, workSubType) => {
                              //   let result = {}
                              //   const modelNormatives = normatives.find(n => n.name === name)
                              //   console.log(name, workSubType)
                              //   const wstNormative = modelNormatives && modelNormatives.workSubTypes.find(wst => wst.name === workSubType)
                              //   const normative = wstNormative && wstNormative.normative
                              //   if (normative) {
                              //     result.nTime = normative
                              //     const wstPrice = wstPrices[workSubType]
                              //     if (wstPrice) result.cost = normative * wstPrice
                              //   }
                              //   return result
                              // })()
                              // ...aggregateMultiple(stats, ['time', 'nTime', 'cost']),
                            })
                            return prods
                          }, []
                        )
                      })
                      return models
                    }, []
                  )
                })
                return workSubTypes
              }, []
            )
          })
          return workTypes
        }, []
      )
    }))
    // add normative time for each product
    monthStats.forEach(exec => {
      exec.workTypes.forEach(wt => {
        if (wt.workType !== 'Прямые') return
        const agg = wt.workSubTypes.reduce((res, wst) => {
          const price = wstPrices[wst.workSubType]
          const agg = wst.models.reduce((res, m) => {
            const modelNorms = _.find(normatives, { name: m.name })
            const wstNorms = modelNorms && _.find(modelNorms.workSubTypes, { name: wst.workSubType })
            const norm = wstNorms && wstNorms.normative
            if (norm) {
              m.nTime = m.prods.length * norm
              m.prods.forEach(p => p.nTime = norm.toFixed(2))
              res.nTime += m.nTime
              if (price) {
                m.cost = m.nTime * price
                m.prods.forEach(p => p.cost = (norm * price).toFixed(0))
                res.cost += m.cost
              }
            }
            return res
          }, { nTime: 0, cost: 0 })
          if (agg.nTime) {
            wst.nTime = agg.nTime
            res.nTime += agg.nTime
          }
          if (agg.cost) {
            wst.cost = agg.cost
            res.cost += agg.cost
          }
          return res
        }, { nTime: 0, cost: 0 })
        if (agg.nTime) {
          wt.nTime = agg.nTime.toFixed(2)
          exec.nTime = wt.nTime
        }
        if (agg.cost) {
          wt.cost = agg.cost.toFixed(0)
          exec.cost = wt.cost
        }
      })
    })
    // nTime and cost toFixed()
    monthStats.forEach(exec => {
      exec.workTypes.forEach(wt => {
        if (wt.workType !== 'Прямые') return
        wt.workSubTypes.forEach(wst => {
          if (wst.nTime) wst.nTime = wst.nTime.toFixed(2)
          if (wst.cost) wst.cost = wst.cost.toFixed(0)
          wst.models.forEach(m => {
            if (m.nTime) m.nTime = m.nTime.toFixed(2)
            if (m.cost) m.cost = m.cost.toFixed(0)
          })
        })
      })
    })
    // console.log(monthStats)
    return (
      <Fragment>
        <div className='komz-no-margin komz-disp-month-grid'>
          <ChartScale chartType='month' monthDate={from} />
          <DatePicker selectedDay={from} chosePeriod={choseMonth} />
          <div className='komz-chart-widget-area'>
            {monthStats.map((stat, i) => {
              const { execName, time } = stat
              return (
                <div className='komz-chart-widget komz-month-chart-widget' key={execName}>
                  <Header className='komz-flex-item-right' style={{ width: 200 }}>
                    {execName}
                    <Header.Subheader className='komz-float-right'>
                      {`${time}ч`}
                    </Header.Subheader>
                    <div style={{ height: 10, borderBottom: '1px solid grey', width: 1455 }}></div>
                  </Header>
                </div>
              )
            })}
          </div>
          <div className='komz-chart komz-month-chart'>
            {[...Array(31)].map((x, i) => {
              const weekend = [5, 6].indexOf(new Date(year, month, i).getDay()) >= 0
              return <div className={`komz-chart-column ${weekend && 'komz-chart-column-weekend'}`} key={`column-${i}`} />
            })}
            {statsByExec.map((stats, i) => stats.map(stat =>
              <DayBar stat={stat} top={i * 50} key={stat.id} />
            ))}
          </div>
        </div>
        <Segment className='komz-no-margin komz-disp-cards-segment' >
          <Card.Group>
            {monthStats.map((stat) => <ExecCard2 dayStat={stat} key={stat.execName} />)}
          </Card.Group>
        </Segment>
      </Fragment>
    )
  }
}

export default graphql(
  dayStats,
  {
    name: 'dayStats',
    options: () => ({
      fetchPolicy: 'cache-and-network',
    })
  }
)(MonthView)
