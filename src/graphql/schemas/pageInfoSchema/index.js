
import gql from 'graphql-tag';

export default gql`
  type PageInfo {
    total: Int!,
    currentPage: Int!,
    limit: Int!,
    hasNext: Boolean!
  }
`;
