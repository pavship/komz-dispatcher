import gql from "graphql-tag";

export const allProds = gql`
  query allProds {
    allProds {
      id
      fullnumber
      time
      model {
        name
      }
      ops {
        workSubType,
        start,
        fin,
        time,
        works {
          id,
          start,
          fin,
          time,
          execName
        }
      }
    }
  }
`
