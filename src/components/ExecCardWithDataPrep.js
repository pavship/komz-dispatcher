import _ from 'lodash'
import React, { Component } from 'react'

import ExecCard from './ExecCard'

class ExecCardWithDataPrep extends Component {
  timer
  state = {
    now: _.now()
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ now: _.now() })
    }, 36000)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    const { now } = this.state
    const { works } = this.props
    const aggregateTime = (col) => {
      return Math.round( col.reduce((sum, { chTime }) => sum + chTime, 0) /36000)/100
    }
    // for live works substitute finish time with current time (every 36 seconds)
    const liveWork = _.find( works, { chTime: null })
    const works1 = !liveWork ? works : [
      ..._.filter( works, 'chTime' ),
      {
        ...liveWork,
        chTime: now - liveWork.chStart
      }
    ]
    const dayStat = {
      execName: works[0].execName,
      time: aggregateTime(works1),
      workTypes: _(works1).sortBy('sortIndex').groupBy('workType').reduce(
        function(workTypes, works, workType) {
          workTypes.push({
            workType,
            time: aggregateTime(works),
            workTypeClass:  (workType === 'Прямые') ? 'main' :
                            (workType === 'Косвенные') ? 'aux' :
                            (workType === 'Побочные') ? 'aside' :
                            (workType === 'Отдых') ? 'rest' : 'negative',
            workSubTypes: _(works).groupBy('workSubType').reduce(
              function(workSubTypes, works, workSubType) {
                // console.log(works);
                // reject null subTypes
                workSubType !== 'null' && workSubTypes.push({
                  workSubType,
                  time: aggregateTime(works),
                  models: _(works).groupBy('models[0].article').reduce(
                    function(models, works, article) {
                      // reject works with undefined models
                      // console.log(models, works, article);
                      if (article !== 'undefined') {
                        const { name, article } = works[0].models[0]
                        const time = aggregateTime(works)
                        models.push({
                          name,
                          article,
                          time,
                          // prods: _(works).map('models[0].prods').value()
                          prods: _(works.map(({ chTime, models }) => {
                            const length = models[0].prods.length
                            return models[0].prods.map(({ id, fullnumber }) => ({
                              id,
                              fullnumber,
                              chTime: chTime/length
                            }))
                          })).flatten().groupBy('id').reduce(
                            function(prods, value, id) {
                              // console.log(prods, value, id);
                              prods.push({
                                id,
                                fullnumber: value[0].fullnumber,
                                time: aggregateTime(value)
                              })
                              return prods
                            }, []
                          )
                        })
                      }
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
    }
    // console.log(workTypes);
    return (
      <ExecCard dayStat={dayStat} />
    )
  }
}

export default ExecCardWithDataPrep
