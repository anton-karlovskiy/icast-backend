/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

import { POOL_STATUS, SPORTS_TYPES } from '~/utils/constants';
import updateCastCollectionWithDistributingResult from '~/engine/services/distributing';
import updateCastCollectionWithScoringResult from '~/engine/services/scoring';
import { updateSoccerFixturesWithDummyScores } from '~/engine/services/soccer/pools';
import { assertAdmin, assertAuthenticated } from '~/graphql/permissions';
import { getObjectId } from '~/utils/helpers/database';
import { getPageInfo } from '~/utils/helpers';
import { POOL_TYPES } from '~/utils/constants';

class poolAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readPoolById = async ({ _id }) => {
    try {
      const pool = this.context.models.poolModel.findOne({ _id });
      return pool;
    } catch (error) {
      console.log('[graphql datasources PoolAPI readPoolById] error => ', error);
      return null;
    }
  };

  // TODO: should be considered about the time's timezone.
  readPools = async ({ filter: { sportsType, type } = {}, offset = 0, limit = null }) => {
    try {
      let conditions = {};
      const date = new Date();
      switch (type) {
      case POOL_STATUS.OPENED:
        conditions = { status: POOL_STATUS.OPENED, startDate: { $lt: date }, endDate: { $gte: date } };
        break;
      case POOL_STATUS.CLOSED:
        conditions = { status: POOL_STATUS.OPENED, endDate: { $lt: date } };
        break;
      case POOL_STATUS.PUBLISHED:
        conditions = { status: POOL_STATUS.PUBLISHED };
        break;
      default:
        conditions = { status: { $in: [POOL_STATUS.OPENED, POOL_STATUS.PUBLISHED] } };
        break;
      }

      if (sportsType) {
        conditions['sportsType.name'] = sportsType; // TODO: sportsType.name hardcorded
      }
      const total = await this.context.models.poolModel.countDocuments(conditions);
      const pools = await this.context.models.poolModel.find(conditions).skip(offset).limit(limit);
      const pageInfo = getPageInfo({ total, offset, limit });
      return { pools, pageInfo };
    } catch (error) {
      console.log('[graphql datasources PoolAPI readPools] error => ', error);
      return [];
    }
  };

  disableOrEnablePool = async ({ _id, disabled }) => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    const status = disabled ? POOL_STATUS.DISABLED : POOL_STATUS.OPENED;
    try {
      const pool = await this.context.models.poolModel.findOneAndUpdate(
        { _id },
        { status: status },
        { new: true }
      );
      return pool;
    } catch (error) {
      console.log('[graphql datasources poolAPI disableOrEnablePool] error => ', error);
      return null;
    }
  };

  deletePool = async ({ _id }) => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const pool = await this.context.models.poolModel.deletePool({ _id });
      return pool;
    } catch (error) {
      console.log('[graphql datasources poolAPI deletePool] error => ', error);
    }
  };

  updatePoolToPublish = async ({ _id }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const pool =
        await this.context.models.poolModel.findOneAndUpdate({ _id }, { status: POOL_STATUS.PUBLISHED }, { new: true });
      return pool;
    } catch (error) {
      console.log('[graphql datasources poolAPI deletePool] error => ', error);
    }
  };

  // TODO: createOrUpdateSoccerPool -> createOrUpdatePool when we store only fixture ids to pool by ref mechanism
  createOrUpdateSoccerPool = async pool => {
    try {
      const newPool = { ...pool, sportsType: { name: SPORTS_TYPES.SOCCER } };
      let result = {};
      if (newPool._id) {
        result = await this.context.models.poolModel.findOneAndUpdate({ _id: newPool._id }, { ...newPool }, { new: true });
      } else {
        result = await this.context.models.poolModel.create({ ...newPool });
      }
      return result;
    } catch (error) {
      console.log('[graphql datasources poolAPI createOrUpdateSoccerPool] error => ', error);
    }
  };

  createOrUpdatePoolScoringAndDistributing = async ({ _id, scoring, distributing }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const pool = await this.context.models.poolModel.findOneAndUpdate({ _id }, { scoring, distributing }, { new: true });
      await updateCastCollectionWithScoringResult(pool._id);
      await updateCastCollectionWithDistributingResult(pool._id);
      return await this.context.models.poolModel.findById(pool._id);
    } catch (error) {
      console.log('[graphql datasources poolAPI createOrUpdatePoolScoringAndDistributing] error => ', error);
    }
  };

  createOrUpdatePoolDisplayingResultSetting = async ({ _id, displayingResultSetting }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      return await this.context.models.poolModel.findOneAndUpdate(
        { _id },
        {
          displayingResultSetting: {
            ...displayingResultSetting,
            _id: getObjectId()
          }
        },
        { new: true }
      );
    } catch (error) {
      console.log('[graphql datasources poolAPI createOrUpdatePoolDisplayingResultSetting] error => ', error);
    }
  }

  // debug logic
  updateSoccerPoolFixturesWithDummyScores = async ({ _id }) => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const pool = await this.context.models.poolModel.findOne({ _id });
      await updateSoccerFixturesWithDummyScores(pool.toObject({ getters: true, virtuals: false }));
      return true;
    } catch (error) {
      console.log('[graphql datasources poolAPI updateSoccerPoolFixturesWithDummyScores] error => ', error);
      return false;
    }
  }

  deductAdminBalance = async ({ poolId }) => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const pool = await this.context.models.poolModel.findOne({ _id: getObjectId(poolId) });
      const poolGroup = await this.context.models.poolGroupModel.findOne({ _id: pool.poolGroupId });
      if (poolGroup && poolGroup.poolType.name === POOL_TYPES.FREE) {
        const casts = await this.context.models.castModel.find({ pool: poolId });
        if (casts || casts.length) {
          let allCachePrize = 0;
          casts.forEach(cast => {
            allCachePrize = allCachePrize + Number(cast.distributingResult.money || 0);
          });
          const admin = await this.context.models.userModel.findOne({ email: this.context.me.email }).exec();
          let adminBalance = admin.balance || 0;
          adminBalance = adminBalance - allCachePrize;
          await this.context.models.userModel.findOneAndUpdate({ email: this.context.me.email }, { balance: adminBalance });
        }
      }
    } catch (error) {
      console.log('[graphql datasources poolAPI deductAdminBalance] error => ', error);
    }
  }
}


export default poolAPI;
