
import { SPORTS_TYPES, RESOLVE_TYPES } from '~/utils/constants';

const fixtureResolver = {
  Fixture: {
    __resolveType(fixture, context, info) {
      if (fixture.specification.__t === SPORTS_TYPES.SOCCER) {
        return RESOLVE_TYPES.SOCCER.FIXTURE;
      }
    }
  },
  Query: {
    fixtures: (_, { sportsType, filters }, { dataSources }) => {
      return dataSources.fixtureAPI.readFixtures({ sportsType, filters });
    },
    upcomingFixturesByLeague: (_, { leagueId }, { dataSources }) => {
      return dataSources.fixtureAPI.readUpcomingFixturesByLeague({ leagueId });
    }
  },
  Mutation: {
    addFixturesFromAPIByLeague: (_, { leagueId }, { dataSources }) => {
      return dataSources.fixtureAPI.addFixturesFromAPIByLeague({ leagueId });
    }
  }
};

export default fixtureResolver;
