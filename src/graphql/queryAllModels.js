import gql from "graphql-tag";

export default gql`
  query queryAllModels {
    allModels {
      id
      article
      name
    }
  }
`
