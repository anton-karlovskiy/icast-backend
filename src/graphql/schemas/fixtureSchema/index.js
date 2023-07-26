
import { gql } from 'apollo-server';

import soccerFixtureSchema from './soccer';

const fixtureSchema = gql`
  interface Fixture {
    _id: ID!, # from mongodb database
    id: Int, # from API
    eventDate: String!,
    status: String!
  }

  input FixtureFilterInput {
    startDate: String!,
    endDate: String!,
    leagueIds: [Int]
    skipFixtureIds: [String]
  }

  extend type Query {
    fixtures(sportsType: SportsTypeEnums!, filters: FixtureFilterInput): [Fixture]
    upcomingFixturesByLeague(leagueId: ID!): [Fixture]!
  }
  extend type Mutation {
    addFixturesFromAPIByLeague(leagueId: ID!): Boolean
  }
`;

export default [
  fixtureSchema,
  soccerFixtureSchema
];
