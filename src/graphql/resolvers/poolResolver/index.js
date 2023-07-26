
import { DISTRIBUTING_TYPES } from '~/utils/constants';

const poolResolver = {
  Query: {
    pool: (_, { _id }, { dataSources }) => {
      return dataSources.poolAPI.readPoolById({ _id });
    },
    pools: (_, { filter, offset, limit }, { dataSources }) => {
      return dataSources.poolAPI.readPools({ filter, offset, limit });
    }
  },
  Mutation: {
    disableOrEnablePool: (_, { _id, disabled }, { dataSources }) => {
      return dataSources.poolAPI.disableOrEnablePool({ _id, disabled });
    },
    deletePool: (_, { _id }, { dataSources }) => {
      return dataSources.poolAPI.deletePool({ _id });
    },
    createOrUpdateSoccerPool: (_, { pool }, { dataSources }) => {
      return dataSources.poolAPI.createOrUpdateSoccerPool(pool);
    },
    createOrUpdatePoolScoringAndDistributing: (_, { _id, scoring, distributing }, { dataSources }) => {
      return dataSources.poolAPI.createOrUpdatePoolScoringAndDistributing({ _id, scoring, distributing });
    },
    createOrUpdatePoolDisplayingResultSetting: (_, { _id, displayingResultSetting }, { dataSources }) => {
      return dataSources.poolAPI.createOrUpdatePoolDisplayingResultSetting({ _id, displayingResultSetting });
    },
    // debug logic
    updateSoccerPoolFixturesWithDummyScores: (_, { _id }, { dataSources }) => {
      return dataSources.poolAPI.updateSoccerPoolFixturesWithDummyScores({ _id });
    },
    updatePoolToPublish: async (_, { _id }, { dataSources }) => {
      const pool = await dataSources.poolAPI.updatePoolToPublish({ _id });
      const casts = await dataSources.castAPI.readCasts({ poolId: _id });
      for (const cast of casts) {
        await dataSources.userAPI.updateUserBalance(
          {
            userId: cast.user._id,
            balance:
              cast.distributingResult ?
                cast.distributingResult.money :
                0
          }
        );
      }
      await dataSources.poolAPI.deductAdminBalance({ poolId: _id });
      return pool;
    }
  },
  Pool: {
    poolGroup: async ({ poolGroupId }, _, { dataSources }) => {
      return await dataSources.poolGroupAPI.readPoolGroup({ _id: poolGroupId, isAll: true });
    },
    casts: async ({ _id }, _, { dataSources }) => {
      return await dataSources.castAPI.readCasts({ poolId: _id });
    },
    casting: async ({ poolGroupId }, _, { dataSources }) => {
      const poolGroup = await dataSources.poolGroupAPI.readPoolGroup({ _id: poolGroupId });
      return poolGroup.casting;
    },
    displayingResult: async ({ _id }, _, { dataSources }) => {
      const pool = await dataSources.poolAPI.readPoolById({ _id });
      const displayingResult = {
        _id: pool._id,
        count: 0,
        displayingInfos: []
      };
      if (!pool.distributing) {
        return displayingResult;
      }
      const casts = await dataSources.castAPI.readCasts({ poolId: _id });
      let totalMoney = 0;
      for (const cast of casts) {
        totalMoney += cast.stake;
      }
      switch (pool.distributing.type) {
      case DISTRIBUTING_TYPES.PERCENTILE:
        displayingResult.count = pool.distributing.percentiles.length;
        displayingResult.displayingInfos = pool.distributing.percentiles.map((percentile, index) => {
          const rankedCast =
            casts.find(
              cast => cast.distributingResult && cast.distributingResult.ranking === percentile.ranking
            );
          const level = rankedCast ?
            rankedCast.distributingResult.level :
            percentile.ranking === 1 ?
              `Top ${percentile.threshold}%` :
              percentile.ranking === pool.distributing.percentiles.length ?
                `Last ${percentile.threshold}%` :
                `Next ${percentile.threshold}%`;
          return {
            _id: pool._id + index,
            ranking: percentile.ranking,
            level,
            percentile: percentile.threshold,
            distributedMoney:
              pool.displayingResultSetting.displayingDistributedMoney ?
                ((totalMoney * pool.distributing.potSize / 100) * percentile.slab / 100).toFixed(2) :
                0,
            totalPlayerCount: pool.displayingResultSetting.displayingTotalPlayerCount ? (
              casts.filter(cast => cast.distributingResult.ranking === percentile.ranking).length
            ) : 0
          };
        });
        break;
      case DISTRIBUTING_TYPES.PRIZE:
        displayingResult.count = pool.distributing.prizes.length;
        displayingResult.displayingInfos = pool.distributing.prizes.map((prize, index) => {
          const rankedCast = casts.find(cast => cast.distributingResult.ranking === prize.ranking);
          const level = rankedCast ? rankedCast.distributingResult.level : null;
          return {
            _id: pool._id + index,
            ranking: prize.ranking,
            level,
            percentile: (pool.distributing.prizes.length / casts.length * 100).toFixed(2),
            distributedMoney: prize.amount,
            totalPlayerCount: 1
          };
        });
        break;
      default: break;
      }
      return displayingResult;
    }
  }
};

export default poolResolver;
