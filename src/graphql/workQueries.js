import gql from "graphql-tag";

export const createWork = gql`
  mutation createWork ( $start: String! $execName: String! $workType: String! $workSubType: String) {
    createWork ( start: $start execName: $execName workType: $workType workSubType: $workSubType ) {
      id
      execName
      start
      fin
      time
      workType
      workSubType
    }
  }
`
export const finishWork = gql`
  mutation finishWork ( $id: ID!, $time: Int!, $fin: String! ) {
    finishWork ( id: $id, time: $time, fin: $fin ) {
      id
      execName
      start
      fin
      time
      workType
      workSubType
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
export const chartWorks = gql`
  query chartWorks ( $period: String! ) {
    chartWorks ( period: $period ) {
      id
      execName
      start
      fin
      time
      workType
      workSubType
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
      workType
      workSubType
      noRecent
    }
  }
`
export const newWork = gql`
  subscription newWork {
    newWork {
      id
      execName
      start
      fin
      time
      workType
      workSubType
    }
  }
`
