import gql from "graphql-tag";

export const dayStats = gql`
  query dayStats ( $from: String!, $to: String!) {
    dayStats ( from: $from, to: $to) {
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
`
