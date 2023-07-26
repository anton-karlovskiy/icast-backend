import { getLeagueSyncState } from '~/engine/services/league';

const leagueResolver = {
  League: {
    isSyncing: async ({ _id }, _, __) => {
      return getLeagueSyncState({ leagueId: _id });
    }
  },
  Query: {
    leagues: (_, { country }, { dataSources }) => {
      return dataSources.leagueAPI.readLeagues({ country });
    },
    countries: (_, __, { dataSources }) => {
      return dataSources.leagueAPI.readLeaguesGroupByCountries();
    }
  },
  Mutation: {
    syncLeague: (_, { leagueId }, { dataSources }) => {
      return dataSources.leagueAPI.syncLeague({ leagueId });
    },
    syncAllLeagues: (_, __, { dataSources }) => {
      return dataSources.leagueAPI.syncAllLeagues();
    }
  }
};

export default leagueResolver;
