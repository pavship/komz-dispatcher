import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { graphql } from "react-apollo"

import { Accordion, List, Divider, Button } from 'semantic-ui-react'
import ProdLine from './ProdLine'
import ModelLine from './ModelLine'

import { allProds } from '../graphql/prodQueries'

import { wstPrices } from '../constants'
import { normatives } from '../constants'

class ProdView extends Component {
  state = { activeIndex: [] }
  handleModelLineClick = (e, el) => {
    const { id } = el
    const { activeIndex } = this.state
    const newIndex = _.includes(activeIndex, id) ? _.without(activeIndex, id) : [...activeIndex, id]
    this.setState({ activeIndex: newIndex })
  }
  collapseAll = () => {
    const length = _.uniqBy(this.props.allProds.allProds, 'model.name').length
    this.setState({ activeIndex: Array.apply(null, { length }).map(Number.call, Number) })
  }
  render() {
    const { activeIndex } = this.state
    const { allProds: { loading, error, allProds } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    // convert milliseconds into hours with 2 digits after dot precision
    const msToHours = (ms) => Math.round(ms / 3600000 * 100) / 100
    const preparedProds = allProds.map(prod => ({
      ...prod,
      time: msToHours(prod.time),
      ops: prod.ops.map(op => ({
        ...op,
        time: msToHours(op.time),
        cost: Math.round(msToHours(op.time) * wstPrices[op.workSubType] * 100) / 100,
        works: op.works.map(work => ({
          ...work,
          time: msToHours(work.time)
        }))
      }))
    }))
    const preparedProds2 = preparedProds.map(prod => ({
      ...prod,
      cost: prod.ops.reduce((sum, op) => sum += op.cost, 0)
    }))
    const prodsByModel = _(preparedProds2).sortBy('model.name', 'ops[0].start').groupBy('model.name').reduce(function (result, value, key) {
      result.push(value)
      return result
    }, [])
    // console.log(prodsByModel);
    const aggregateTime = (stats) => Math.round(stats.reduce((sum, stat) => sum += stat.time, 0) * 100) / 100
    // following function returns lodash object for chaining
    const aggregateAndGroupItems = (xs, key, gKey) => _(xs.reduce((rv, x) => [...rv, ...x[key]], [])).groupBy(gKey || key)
    const hideStaff = () => {

      // const monthStats = statsByExec.map(stats => ({
      //   execName: stats[0].execName,
      //   time: aggregateTime(stats),
      //   workTypes: aggregateAndGroupItems(stats, 'workTypes', 'workType').reduce(
      //     function (workTypes, stats, workType) {
      //       workTypes.push({
      //         workType,
      //         time: aggregateTime(stats),
      //         workTypeClass: stats[0].workTypeClass,
      //         workSubTypes: aggregateAndGroupItems(stats, 'workSubTypes', 'workSubType').reduce(
      //           function (workSubTypes, stats, workSubType) {
      //             workSubTypes.push({
      //               workSubType,
      //               time: aggregateTime(stats),
      //               models: aggregateAndGroupItems(stats, 'models', 'article').reduce(
      //                 function (models, stats, article) {
      //                   models.push({
      //                     name: stats[0].name,
      //                     article,
      //                     time: aggregateTime(stats),
      //                     prods: aggregateAndGroupItems(stats, 'prods', 'id').reduce(
      //                       function (prods, stats, id) {
      //                         prods.push({
      //                           id,
      //                           fullnumber: stats[0].fullnumber,
      //                           time: aggregateTime(stats),
      //                         })
      //                         return prods
      //                       }, []
      //                     )
      //                   })
      //                   return models
      //                 }, []
      //               )
      //             })
      //             return workSubTypes
      //           }, []
      //         )
      //       })
      //       return workTypes
      //     }, []
      //   )
      // }))
      // console.log(monthStats)
    }

    return (
      <div className='komz-prod-view'>
        <Button icon='window minimize' content='Свернуть все' size='tiny' labelPosition='left' floated='right'
          onClick={this.collapseAll} className='komz-prod-view-collapse-button' />
        <Accordion>
          {prodsByModel.map((prods, i) => {
            const id = prods[0].id.split('-')[0]
            const active = _.includes(activeIndex, id)
            const model = {
              ...prods[0].model,
              id,
              active,
              qty: prods.length,
              normatives: normatives.find(m => m.id === id).workSubTypes
            }
            return <Fragment key={id} >
              <ModelLine {...model} onClick={this.handleModelLineClick} />
              {active &&
                <Accordion.Content active>
                  <Divider className='komz-no-margin' />
                  <List divided selection size='medium' className='komz-no-margin'>
                    {prods.map((prod) => <ProdLine prod={prod} key={prod.id} />)}
                  </List>
                  <Divider className='komz-no-margin' />
                </Accordion.Content>
              }
            </Fragment>
          })}
        </Accordion>
      </div>
    )
  }
}

export default graphql(
  allProds,
  {
    name: 'allProds',
    // options: () => ({
    //   fetchPolicy: 'cache-and-network',
    //   // fetchPolicy: 'cache-only',
    // })
  }
)(ProdView)
