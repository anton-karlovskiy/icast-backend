
import { SPORTS_TYPES, RESOLVE_TYPES } from '~/utils/constants';

const teamResolver = {
  Team: {
    __resolveType(team, context, info) {
      if (!team.specification) {
        return RESOLVE_TYPES.SOCCER.TEAM;
      }
      if (team.specification.__t === SPORTS_TYPES.SOCCER) {
        return RESOLVE_TYPES.SOCCER.TEAM;
      }
    }
  },
  Query: {
    teamsByLeague: (_, { leagueId }, { dataSources }) => {
      return dataSources.teamAPI.readTeamsByLeague({ leagueId });
    }
  }
};

export default teamResolver;
