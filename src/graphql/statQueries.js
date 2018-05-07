import gql from "graphql-tag";

export const dayStats = gql`
  query dayStats ( $month: String! ) {
    dayStats ( month: $month ) {
      id
      execName
      time
      workTypes {
        name
        time
        workSubTypes {
          name
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
