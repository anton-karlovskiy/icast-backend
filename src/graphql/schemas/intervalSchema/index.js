
import { gql } from 'apollo-server';

const intervalSchema = gql`
  type Interval {
    _id: ID!,
    value: Int!
  }

  input IntervalInput {
    _id: String!,
    value: Int!
  }

  extend type Query {
    intervals: [Interval!]!
  }
`;

export default [
  intervalSchema
];
