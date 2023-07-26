
import { gql } from 'apollo-server';

export default gql`
  type SoccerPoolGroup implements PoolGroup {
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
    pools: [Pool],
    specification: SoccerPoolGroupSpecification!
  }

  type SoccerPoolGroupSpecification {
    isHomeFirst: Boolean,
    leagues: [League]!
  }

  input SoccerPoolGroupInput {
    _id: String,
    name: String!,
    prefix: String!,
    startDate: String!,
    endDate: String!,
    enabled: Boolean,
    maxFixtureCount: Int!,
    howToPlay: String,
    interval: IntervalInput!,
    poolType: PoolTypeInput!,
    preferredTeams: [SoccerTeamInput],
    casting: SoccerCastingInput!,
    scoring: ScoringAlgorithmEnums,
    distributing: DistributingInput,
    specification: SoccerPoolGroupSpecificationInput!
  }

  input SoccerPoolGroupSpecificationInput {
    isHomeFirst: Boolean,
    leagues: [LeagueInput]!
  }

  extend type Mutation {
    createOrUpdateSoccerPoolGroup(poolGroup: SoccerPoolGroupInput!): PoolGroup!,
  }
`;
