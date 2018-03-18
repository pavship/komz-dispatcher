import gql from "graphql-tag";

export const createWork = gql`
  mutation createWork ( $start: String! ) {
    createWork ( start: $start ) {
      id
      start
      fin
      time
    }
  }
`
export const finishWork = gql`
  mutation finishWork ( $id: ID!, $time: Int!, $fin: String! ) {
    finishWork ( id: $id, time: $time, fin: $fin ) {
      id
      start
      fin
      time
    }
  }
`
export const allWorks = gql`
  query allWorks {
    allWorks {
      id
      start
      fin
      time
    }
  }
`
export const getCurWork = gql`
  query getCurWork {
    getCurWork {
      id
      start
      fin
      time
    }
  }
`
export const newWork = gql`
  subscription newWork {
    newWork {
      __typename
      id
      start
      fin
      time
    }
  }
`
