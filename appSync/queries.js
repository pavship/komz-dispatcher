mutation createWork {
 createWork (
    start: "sidfjsf",
    end: null
  ){
    id
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
