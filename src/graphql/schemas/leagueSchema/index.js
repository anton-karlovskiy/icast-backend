
import { gql } from 'apollo-server';

const leagueSchema = gql`
  type League {
    _id: ID!,   # from mongodb database
    id: Int!,   # from API
    name: String!,
    sportsType: SportsType,
    country: String!,
    season: String,
    logo: String,
    flag: String,
    standings: Int,
    isCurrent: Int,
    isSyncing: Boolean
  }

  input LeagueInput {
    _id: String!,
    id: Int!,
    name: String!,
    sportsType: SportsTypeInput,
    country: String!,
    contryCode: String,
    season: String,
    logo: String,
    flag: String,
    standings: Int,
    isCurrent: Int,
    isSyncing: Boolean
  }

  extend type Query {
    leagues(country: String): [League!]!
    countries: [League!]!
  }
  extend type Mutation {
    syncLeague(leagueId: ID!): ID!
    syncAllLeagues: Boolean!
  }
`;

export default [
  leagueSchema
];
