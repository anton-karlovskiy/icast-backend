
import { SPORTS_TYPES, RESOLVE_TYPES } from '~/utils/constants';

const castingResovler = {
  Casting: {
    __resolveType(casting, context, info) {
      if (casting.specification.__t === SPORTS_TYPES.SOCCER) {
        return RESOLVE_TYPES.SOCCER.CASTING;
      }
    }
  },
  Query: {
    castings: (_, __, { dataSources }) => {
      return dataSources.castingAPI.readCastings();
    }
  }
};

export default castingResovler;
