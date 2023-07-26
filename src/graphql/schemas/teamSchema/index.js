
import { gql } from 'apollo-server';

import soccerTeamSchema from './soccer';

const teamSchema = gql`
  interface Team {
    _id: ID!,   # from mongodb database
    id: Int!,   # from API
    name: String,
    logo: String,
    country: String
  }

  extend type Query {
    teamsByLeague(leagueId: Int!): [Team!]!
  }
`;

export default [
  teamSchema,
  soccerTeamSchema
];
