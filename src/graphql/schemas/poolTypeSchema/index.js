
import { gql } from 'apollo-server';

const poolTypeSchema = gql`
  type PoolType {
    _id: String!,
    name: PoolTypeEnums
  }

  input PoolTypeInput {
    _id: String!,
    name: PoolTypeEnums
  }

  enum PoolTypeEnums {
    FREE,
    PAID
  }

  extend type Query {
    poolTypes: [PoolType!]!
  }
`;

export default [poolTypeSchema];
