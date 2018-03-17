import gql from "graphql-tag";

export const createWork = gql`
  mutation createWork ( $start: String! $end: String ) {
    createWork ( start: $start end: $end ) {
      id
      start
      end
    }
  }
`

export const allWorks = gql`
  query allWorks {
    allWorks {
      id
      start
      end
    }
  }
`

export const newWork = gql`
  subscription newWork {
    newWork {
      __typename
      id
      start
      end
    }
  }
`
