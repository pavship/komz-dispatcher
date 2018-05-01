const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'})

exports.handler = ({ command, args }, context, callback) => {
    console.log("Received command: ", command, " with args: ", args)
    //perform logic
    switch(command) {
        case "edit":
            // define basic DynamoDB request params
            const params = {
              TableName: 'EnremkolWorkTable',
              Key: {
                orgId: 1,
                id: args.id
              },
              ReturnValues: 'ALL_OLD'
            }
            const deleteWork = (callback) => {
                documentClient.delete(params, function(err, data) {
                  if (err) {
                      console.log(err)
                      callback("DynamoDB deleteWork operation was unsuccessful -> " + args.id, null)
                  } else {
                      const dataIsEmpty = Object.keys(data).length === 0 && data.constructor === Object
                      if ( dataIsEmpty ) callback("DynamoDB deleteWork operation returned empty object", null)
                      callback(data)
                  }
                })
            }
            if (args.delete) {
                // handle delete request
                deleteWork((data) => {
                    callback(null, {...data.Attributes, deleted: data.Attributes.id})
                })
            } else {
                // handle edit request
                let time = null
                // write work duration into 'time' var, if the work is finished
                if (args.fin) {
                    // start and fin in epoch
                    const start_ep = Date.parse(args.start)
                    const fin_ep = Date.parse(args.fin)
                    // validation
                    // TODO dates validation with regards to adjacent works
                    const diff = fin_ep - start_ep
                    if (diff > 0) {
                        // work duration in seconds
                        time = Math.round(diff/1000)
                    } else {
                        callback("wrong 'start' and 'fin' datetimes provided for updateWork operation", null)
                    }
                }
                // 1. Delete work (need to substitute work record in DB table, because impossible to update id-key attribute)
                deleteWork((data) => {
                    const oldId = data.Attributes.id
                    const id = args.start + oldId.slice(24)
                    // new item to write into DB
                    const item = {
                        ...data.Attributes,
                        start: args.start,
                        fin: args.fin || null,
                        time,
                        id
                    }
                    // 2. Put altered item into DB
                    const putParams = {
                        TableName: 'EnremkolWorkTable',
                        Item: item
                    }
                    documentClient.put(putParams, function(err, data) {
                        if (err) {
                            console.log(err)
                            callback("WARNING! DynamoDB putWork operation was unsuccessful, but edited work was deleted! -> " + oldId, null)
                        } else {
                            // 3. Get written item (dynamodb.putItem method isn't able to return new item)
                            const getParams = {
                                TableName: 'EnremkolWorkTable',
                                Key: {
                                    orgId: 1,
                                    id: id
                                }
                            }
                            documentClient.get(getParams, function(err, data) {
                                if (err) {
                                    console.log(err)
                                    callback("DynamoDB getWork operation was unsuccessful after edited work was put into DB -> " + id, null)
                                } else {
                                    const dataIsEmpty = Object.keys(data).length === 0 && data.constructor === Object
                                    if ( dataIsEmpty ) callback("DynamoDB getWork operation returned empty object after edited work was put into DB -> " + id, null)
                                    // 'deleted' attribute is used in frontend to handle edited works received within subscription
                                    // deleted attr equals oldId of edited item. If id hasn't changed, deleted is set to null
                                    console.log(oldId, id, oldId === id)
                                    callback(null, { ...data.Item, deleted: oldId === id ? null : oldId })
                                }
                            })
                        }
                    })
                })
                // UPDATE DynamoDB op not used in this Lambda
                // const extendedParams = {
                //     ...params,
                //     UpdateExpression: 'SET #start = :start, fin = :fin, #time = :time',
                //     ExpressionAttributeNames: {'#start' : 'start', '#time' : 'time'},
                //     ExpressionAttributeValues: {
                //         ':start': args.start,
                //         ':fin': args.fin || null,
                //         ':time': time
                //     },
                //     ReturnValues: 'ALL_NEW'
                // }
                // documentClient.update(extendedParams, function(err, data) {
                //   if (err) {
                //       console.log(err)
                //       callback("DynamoDB updateWork operation was unsuccessful -> " + args.id, null)
                //   } else {
                //       const dataIsEmpty = Object.keys(data).length === 0 && data.constructor === Object
                //       if ( dataIsEmpty ) callback("DynamoDB updateWork operation returned empty object", null)
                //       callback(null, {...data.Attributes})
                //   }
                // })
            }
            break
        default:
            callback("Unknown command <- " + command, null)
            break
    }
}
