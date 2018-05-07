import gql from "graphql-tag";

export const dayStats = gql`
  query dayStats ( $month: String! ) {
    dayStats ( month: $month ) {
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
