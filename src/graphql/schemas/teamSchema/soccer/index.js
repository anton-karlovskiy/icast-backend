
import { gql } from 'apollo-server';

export default gql`
  type SoccerTeam implements Team {
    _id: ID!,
    id: Int!,
    name: String!,
    logo: String,
    country: String,
    specification: SoccerTeamSpecification
  }

  type SoccerTeamSpecification {
    league: League!
  }

  input SoccerTeamInput {
    _id: ID!,
    id: Int!,
    name: String,
    logo: String,
    country: String,
    specification: SoccerTeamSpecificationInput
  }

  input SoccerTeamSpecificationInput {
    league: LeagueInput!
  }
`;
