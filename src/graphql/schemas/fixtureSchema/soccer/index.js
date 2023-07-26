
import { gql } from 'apollo-server';

export default gql`
  type SoccerFixture implements Fixture {
    _id: ID!,
    id: Int,
    eventDate: String!,
    status: String!,
    specification: SoccerFixtureSpecification!
  }

  type SoccerFixtureSpecification {
    staticId: Int!,
    goalsHomeTeam: String,
    goalsAwayTeam: String,
    league: League!,
    homeTeam: SoccerTeam!,
    awayTeam: SoccerTeam!
  }

  input SoccerFixtureInput {
    _id: ID!,
    id: Int,
    eventDate: String!,
    status: String!,
    specification: SoccerFixtureSpecificationInput
  }

  input SoccerFixtureSpecificationInput {
    staticId: Int,
    goalsHomeTeam: String,
    goalsAwayTeam: String,
    league: LeagueInput!,
    homeTeam: SoccerTeamInput!,
    awayTeam: SoccerTeamInput!
  }
`;
