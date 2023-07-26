
import { gql } from 'apollo-server';

import soccerPoolGroupSchema from './soccer';

const poolGroupSchema = gql`
  interface PoolGroup {
    _id: ID!,
    name: String!,
    sportsType: SportsType!,
    prefix: String!,
    startDate: String!,
    endDate: String!,
    maxFixtureCount: Int!,
    howToPlay: String,
    enabled: Boolean!,
    interval: Interval!,
    poolType: PoolType!,
    preferredTeams: [Team!],
    casting: Casting!,
    scoring: ScoringAlgorithmEnums,
    distributing: Distributing,
    pools: [Pool]
  }

  enum ScoringAlgorithmEnums {
    DEFAULT
  }

  extend type Query {
    poolGroups(sportsType: SportsTypeEnums!): [PoolGroup]!,
    poolGroup(_id: String): PoolGroup!
  }

  extend type Mutation {
    disableOrEnablePoolGroup(_id: String!, disabled: Boolean!): PoolGroup!,
    deletePoolGroup(_id: String!): PoolGroup!
  }
`;

export default [
  poolGroupSchema,
  soccerPoolGroupSchema
];
