subscription newWork {
  newWork {
    id
    start
    fin
    time
  }
}
mutation createWork {
  createWork (
    execName: "Портной С."
    start: "2018-04-13T01:00:00.000Z"
    workType: "Побочные"
  ) {
    id
    exec
    execName
    start
    fin
    time
  }
}
mutation finishWork {
  finishWork (
    id: "2018-04-06T10:00:00.000Z-8a25d269a30d"
    fin: "2018-04-13T02:00:00.000Z"
    time: 3600
  ) {
    id
    exec
    execName
    start
    fin
    time
  }
}
mutation editWork {
  editWork (
    id: "2018-04-06T10:00:00.000Z-8a25d269a30d"
    delete: true
  ) {
    id
    exec
    execName
    start
    fin
    time
  }
}
query allWorks {
  allWorks {
    id
    start
    fin
    time
  }
}
query currentUser {
  currentUser {
    id
    name
    gqDept
  }
}
query User {
  User (id: "33a0db27-51cc-40d7-8835-873c16cb5669") {
    id
    name
    gqDept
  }
}
query allUsers {
  allUsers {
    id
    name
    gqDept
    isDisp
  }
}
query allModels {
  allModels {
    article
    name
  }
}
query deptModels {
  deptModels(
    deptId: "cjbuuvddo4opm0147d178zmuy"
  ) {
    id
    model {
      id
      article
      name
    }
  }
}
query dayStats {
  dayStats (
    month: "2018-03-29T21"
  ) {
    id
    time
    execName
    workTypes {
      workType
      workTypeClass
      time
      workSubTypes {
        workSubType
        time
        models {
          name
          article
          time
          prods {
            id
            fullnumber
            time
          }
        }
      }
    }
  }
}
