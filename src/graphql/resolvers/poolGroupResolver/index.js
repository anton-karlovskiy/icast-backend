
import { SPORTS_TYPES, RESOLVE_TYPES } from '~/utils/constants';

const poolGroupResolver = {
  PoolGroup: {
    __resolveType(poolGroup, context, info) {
      if (poolGroup.specification.__t === SPORTS_TYPES.SOCCER) {
        return RESOLVE_TYPES.SOCCER.POOL_GROUP;
      }
    }
  },
  Query: {
    poolGroups: (_, { sportsType }, { dataSources }) => {
      return dataSources.poolGroupAPI.readPoolGroups({ sportsType });
    },
    poolGroup: (_, { _id }, { dataSources }) => {
      return dataSources.poolGroupAPI.readPoolGroup({ _id });
    }
  },
  Mutation: {
    disableOrEnablePoolGroup: (_, { _id, disabled }, { dataSources }) => {
      return dataSources.poolGroupAPI.disableOrEnablePoolGroup({ _id, disabled });
    },
    deletePoolGroup: (_, { _id }, { dataSources }) => {
      return dataSources.poolGroupAPI.deletePoolGroup({ _id });
    },
    createOrUpdateSoccerPoolGroup: (_, { poolGroup }, { dataSources }) => {
      return dataSources.poolGroupAPI.createOrUpdateSoccerPoolGroup(poolGroup);
    }
  }
};

export default poolGroupResolver;
