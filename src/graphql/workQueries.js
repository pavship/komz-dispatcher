import gql from "graphql-tag";

export const chartWorks = gql`
  query chartWorks ( $queryFrom: String!, $from: String!, $to: String ) {
    chartWorks ( queryFrom: $queryFrom, from: $from, to: $to ) {
      id
      execName
      start
      fin
      time
      workType
      workSubType
      models {
        name
        article
        prods {
          id
          fullnumber
        }
      }
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
      models {
        id
        name
        article
        prods {
          id
          fullnumber
        }
      }
    }
  }
`
