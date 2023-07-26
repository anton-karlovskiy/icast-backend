/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

import { assertAuthenticated, assertAdmin } from '~/graphql/permissions';
import { getPageInfo } from '~/utils/helpers';
import { isValidObjectId, getObjectId } from '~/utils/helpers/database';
import { POOL_TYPES, POOL_STATUS, DISPLAYING_CAST_TYPES, USER_ROLES } from '~/utils/constants';

const checkDisplayingResultSetting = ({ type, displayingResultSetting }) => {
  if (type === DISPLAYING_CAST_TYPES.TOP && !displayingResultSetting.displayingTopAmounts ||
    type === DISPLAYING_CAST_TYPES.BOTTOM && !displayingResultSetting.displayingBottomAmounts) {
    return false;
  }
  return true;
};

class CastAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readMyCast = async ({ poolId }) => {
    assertAuthenticated(this.context);

    try {
      const me = this.context.me;
      const condition = poolId ? { pool: poolId, user: me._id } : { user: me._id };
      const cast = await this.context.models.castModel.findOne(condition)
        .populate('user')
        .populate('pool')
        .populate('castInfos.fixture')
        .exec();
      return cast;
    } catch (error) {
      console.log('[graphql datasources CastAPI readMyCast] error => ', error);
    }
  }

  // TODO: should be updated when using poolGroup ref instead of poolGroupId
  readMyCasts = async ({ filter, offset = 0, limit = null }) => {
    assertAuthenticated(this.context);

    try {
      const me = this.context.me;
      const date = new Date();
      const poolCondition = {
        'sportsType.name': filter.sportsType,
        status: filter.states[0] === POOL_STATUS.CLOSED ? { $in: [POOL_STATUS.OPENED] } : { $in: filter.states }
      };
      if (filter.states[0] === POOL_STATUS.CLOSED) {
        poolCondition.startDate = { $lt: date };
      }
      const pools = await this.context.models.poolModel.find(poolCondition).populate({ path: 'poolGroupId', select: 'casting' });
      const poolIds = pools.map(pool => pool._id);
      const castCondition = { user: me._id, pool: { $in: poolIds } };
      const casts = await this.context.models.castModel.find(castCondition)
        .sort({
          createdAt: -1,
          _id: 1
        })
        .skip(offset)
        .limit(limit)
        .populate('user')
        .populate('pool')
        .populate('castInfos.fixture')
        .lean()
        .exec();

      const total = await this.context.models.castModel.countDocuments(castCondition);
      const pageInfo = getPageInfo({ total, offset, limit });
      return { casts, pageInfo };
    } catch (error) {
      console.log('[graphql datasources CastAPI readMyCasts] error => ', error);
    }
  };

  readCasts = async ({
    poolId,
    offset = 0,
    limit = null
  }) => {
    assertAuthenticated(this.context);

    try {
      const condition = { pool: poolId };
      const casts = await this.context.models.castModel.find(condition)
        // MEMO: https://docs.mongodb.com/manual/reference/method/cursor.sort/#sort-stability
        .sort({
          scoringResult: 1,
          _id: 1
        })
        .skip(offset)
        .limit(limit)
        .populate('user')
        .populate('pool')
        .populate('castInfos.fixture')
        .exec();

      const total = await this.context.models.castModel.countDocuments(condition);
      const pageInfo = getPageInfo({ total, offset, limit });
      return limit ? { casts, pageInfo } : casts;
    } catch (error) {
      console.log('[readCasts] error => ', error);
    }
  };

  readResultCasts = async ({ filter, offset = 0, limit = null }) => {
    assertAuthenticated(this.context);

    try {
      const pool = await this.context.models.poolModel.findOne({ _id: filter.poolId });
      if (!checkDisplayingResultSetting({ type: filter.type, displayingResultSetting: pool.displayingResultSetting })) {
        return { casts: [], pageInfo: { total: 0, limit: 0, currentPage: 0, hasNext: false } };
      }
      const condition = { pool: filter.poolId };
      const total =
        filter.type === DISPLAYING_CAST_TYPES.TOP ?
          pool.displayingResultSetting.topAmountsCount :
          pool.displayingResultSetting.bottomAmountsCount;
      const casts = await this.context.models.castModel.find(condition)
        .sort({
          scoringResult: filter.type === DISPLAYING_CAST_TYPES.TOP ? 1 : -1,
          _id: 1
        })
        .skip(offset)
        .limit((offset + limit) > total ? total - offset : limit)
        .populate('user')
        .exec();
      const pageInfo = getPageInfo({ total, offset, limit });
      return { casts, pageInfo };
    } catch (error) {
      console.log('[graphql datasources CastAPI readResultCasts] error => ', error);
    }
  };

  createOrUpdateSoccerCasts = async ({ casts }) => {
    assertAuthenticated(this.context);

    try {
      const me = this.context.me;
      let newCasts = [];
      for (const cast of casts) {
        const newCast = { ...cast, user: me._id, pool: cast.poolId };
        const pool = await this.context.models.poolModel.findOne({ _id: cast.poolId, status: POOL_STATUS.OPENED });
        if (!pool) {
          continue;
        }
        const existingCast = isValidObjectId(cast._id) && await this.context.models.castModel.findOne({ _id: cast._id });
        existingCast ? (
          await this.context.models.castModel.findOneAndUpdate({ _id: newCast._id }, { ...newCast })
        ) : (
          await this.context.models.castModel.create({ ...newCast, _id: getObjectId() })
        );
        const newCreatedCast = await this.context.models.castModel.findOne({ user: newCast.user, pool: cast.poolId })
          .populate('user')
          .populate('pool')
          .populate('castInfos.fixture')
          .exec();
        newCasts = [...newCasts, newCreatedCast];
      }
      return newCasts;
    } catch (error) {
      console.log('[graphql datasources CastAPI createOrUpdateSoccerCasts] error => ', error);
    }
  };

  deleteCast = async ({ _id }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    const cast = await this.context.models.castModel.findByIdAndDelete(_id);
    return cast;
  };

  // TODO: should handle the dev logic
  createDummyCasts = async ({ poolId, sportsType }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const users = await this.context.models.userModel.find({ roles: { $in: [USER_ROLES.PAID_USER, USER_ROLES.FREE_USER] } });
      const pool = await this.context.models.poolModel.findOne({ _id: poolId }).populate('poolGroupId');
      const module = await import('chance');
      const Chance = module.default;
      const chance = new Chance();
      for (const user of users) {
        const castInfos = pool.fixtures.map(fixture => {
          return {
            fixture: fixture._id,
            specification: {
              __t: sportsType,
              goalsHomeTeam: chance.d10(),
              goalsAwayTeam: chance.d10()
            }
          };
        });

        const cast = {
          stake: pool.poolGroupId.poolType.name === POOL_TYPES.FREE ? 1 : chance.integer({ min: 0, max: 5000 }),
          user: user._id,
          pool: pool._id,
          castInfos
        };
        const existCast = await this.context.models.castModel.findOne({ user: user._id, pool: pool._id });
        if (existCast) {
          await this.context.models.castModel.findOneAndUpdate({ user: user._id, pool: pool._id }, cast);
        } else {
          await this.context.models.castModel.create(cast);
        }
      }
      return true;
    } catch (error) {
      console.log('[graphql datasources CastAPI createDummyCasts] error => ', error);
      return false;
    }
  };
}

export default CastAPI;
