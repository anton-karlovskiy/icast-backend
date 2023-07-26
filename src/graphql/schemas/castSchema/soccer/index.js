
import { gql } from 'apollo-server';

export default gql`
  type SoccerCastInfo implements CastInfo {
    fixture: Fixture!,
    specification: SoccerCastInfoSpecification
  }

  type SoccerCastInfoSpecification {
    goalsHomeTeam: Int!,
    goalsAwayTeam: Int!
  }

  input SoccerCastInput {
    _id: ID!,
    poolId: ID!,
    stake: Float!,
    castInfos: [SoccerCastInfoInput!]!
  }

  input SoccerCastInfoInput {
    fixture: ID!,
    specification: SoccerCastInfoSpecificationInput
  }

  input SoccerCastInfoSpecificationInput {
    goalsHomeTeam: Int!,
    goalsAwayTeam: Int!
  }

  extend type Mutation {
    createOrUpdateSoccerCasts(casts: [SoccerCastInput!]!): [Cast!]!
  }
`;
