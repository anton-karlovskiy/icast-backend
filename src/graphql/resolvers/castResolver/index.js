
import { SPORTS_TYPES, RESOLVE_TYPES } from '~/utils/constants';

const castResolver = {
  CastInfo: {
    __resolveType(castInfo, context, info) {
      if (castInfo.specification.__t === SPORTS_TYPES.SOCCER) {
        return RESOLVE_TYPES.SOCCER.CAST_INFO;
      }
    }
  },
  Query: {
    casts: (_, { poolId, offset, limit }, { dataSources }) => {
      return dataSources.castAPI.readCasts({ poolId, offset, limit });
    },
    myCast: (_, { poolId }, { dataSources }) => {
      return dataSources.castAPI.readMyCast({ poolId });
    },
    myCasts: (_, { filter, offset, limit }, { dataSources }) => {
      return dataSources.castAPI.readMyCasts({ filter, offset, limit });
    },
    resultCasts: (_, { filter, offset, limit }, { dataSources }) => {
      return dataSources.castAPI.readResultCasts({ filter, offset, limit });
    }
  },
  Mutation: {
    createOrUpdateSoccerCasts: (_, { casts }, { dataSources }) => {
      return dataSources.castAPI.createOrUpdateSoccerCasts({ casts });
    },
    deleteCast: (_, { _id }, { dataSources }) => {
      return dataSources.castAPI.deleteCast({ _id });
    },
    createDummyCasts: (_, { poolId, sportsType }, { dataSources }) => {
      return dataSources.castAPI.createDummyCasts({ poolId, sportsType });
    }
  }
};

export default castResolver;
