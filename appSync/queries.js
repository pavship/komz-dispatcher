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
    start: "2018-04-06T10:00:00.000Z"
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
    fin: "2018-04-07T11:00:00.000Z"
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
#
# An example mutation might look like:
#
#     mutation PutPost {
#       putPost(id: 123, title: "Hello, world!") {
#         id
#         title
#       }
#     }
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
