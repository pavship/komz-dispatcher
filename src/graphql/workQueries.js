import gql from "graphql-tag";

export const createWork = gql(`
  mutation createWork ( $start: String! $end: String ) {
    createWork ( start: $start end: $end ) {
      id
    }
  }
`)
