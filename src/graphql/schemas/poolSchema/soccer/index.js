
import { gql } from 'apollo-server';

export default gql`
  input SoccerPoolInput {
    _id: ID,
    poolGroupId: ID!,
    name: String!,
    fixtures: [SoccerFixtureInput]!
    startDate: String!,
    endDate: String!,
    sportsType: SportsTypeInput!,
    status: PoolStatusEnums!,
    maxFixtureCount: Int!,
    scoring: ScoringAlgorithmEnums,
    distributing: DistributingInput,
  }

  extend type Mutation {
    createOrUpdateSoccerPool(pool: SoccerPoolInput): Pool!,
    updateSoccerPoolFixturesWithDummyScores(_id: ID!): Boolean!
  }
`;
