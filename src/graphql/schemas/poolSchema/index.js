
import { gql } from 'apollo-server';

import soccerPoolSchema from './soccer';

const poolSchema = gql`
  type Pool {
    _id: ID!,
    poolGroupId: ID!,
    poolGroup: PoolGroup!,
    name: String!,
    fixtures: [Fixture]!,
    startDate: String!,
    endDate: String!,
    sportsType: SportsType!,
    status: PoolStatusEnums!,
    maxFixtureCount: Int!,
    scoring: ScoringAlgorithmEnums,
    distributing: Distributing,
    casting: Casting,
    casts: [Cast!]!,
    displayingResultSetting: DisplayingResultSetting!
    displayingResult: DisplayingResult
  }

  type DisplayingResult {
    _id: ID!,
    count: Int!,
    displayingInfos: [DisplayingInfo!]!
  }

  type DisplayingInfo {
    _id: ID!,
    ranking: Int!,
    percentile: Float!,
    level: String,
    distributedMoney: Float!,
    totalPlayerCount: Int!
  }

  type DisplayingResultSetting {
    _id: ID!,
    displayingDistributedMoney: Boolean!,
    displayingTotalPlayerCount: Boolean!,
    displayingTopAmounts: Boolean!,
    displayingBottomAmounts: Boolean!,
    topAmountsCount: Int,
    bottomAmountsCount: Int
  }

  input DisplayingResultSettingInput {
    displayingDistributedMoney: Boolean!,
    displayingTotalPlayerCount: Boolean!,
    displayingTopAmounts: Boolean!,
    displayingBottomAmounts: Boolean!,
    topAmountsCount: Int,
    bottomAmountsCount: Int
  }

  input poolFilterInput {
    sportsType: SportsTypeEnums!,
    type: PoolStatusEnums
  }

  enum PoolStatusEnums {
    CREATED,
    OPENED,
    CLOSED,
    PUBLISHED,
    DISABLED
  }

  type PoolsResponse {
    pools: [Pool!]!,
    pageInfo: PageInfo!
  }

  extend type Query {
    pool(_id: ID!): Pool,
    pools(filter: poolFilterInput, offset: Int, limit: Int): PoolsResponse!
  }

  extend type Mutation {
    createOrUpdatePoolScoringAndDistributing(_id: ID!, scoring: ScoringAlgorithmEnums!, distributing: DistributingInput!): Pool!,
    createOrUpdatePoolDisplayingResultSetting(_id: ID!, displayingResultSetting: DisplayingResultSettingInput!): Pool!
    disableOrEnablePool(_id: ID!, disabled: Boolean!): Pool!,
    deletePool(_id: ID!): Pool!,
    updatePoolToPublish(_id: ID!): Pool!
  }
`;

export default [
  poolSchema,
  soccerPoolSchema
];
