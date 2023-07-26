
import { gql } from 'apollo-server';

import soccerCastSchema from './soccer';

const castSchema = gql`
  type Cast {
    _id: ID!,
    user: User,
    pool: Pool!,
    stake: Float!,
    castInfos: [CastInfo!]!
    scoringResult: Float,
    distributingResult: DistributingResult,
    updatedAt: String! # timestamp of date
  }

  interface CastInfo {
    fixture: Fixture!
  }

  type DistributingResult {
    money: Float,
    ranking: Int,
    level: String
  }

  type CastsResponse {
    casts: [Cast!]!
    pageInfo: PageInfo
  }

  input MyCastFilterInput {
    sportsType: SportsTypeEnums!,
    states: [PoolStatusEnums!]!
  }

  input ResultCastsFilterInput {
    poolId: ID!,
    type: String!
  }

  extend type Query {
    myCast(poolId: ID!): Cast,
    resultCasts(filter: ResultCastsFilterInput!, offset: Int, limit: Int): CastsResponse
    myCasts(filter: MyCastFilterInput!, offset: Int, limit: Int): CastsResponse
    casts(poolId: ID, offset: Int, limit: Int): CastsResponse!
  }

  extend type Mutation {
    deleteCast(_id: ID!): Cast
    # dev logic
    createDummyCasts(poolId: ID!, sportsType: SportsTypeEnums!): Boolean
  }
`;

export default [castSchema, soccerCastSchema];
