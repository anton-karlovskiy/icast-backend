/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

import { readPoolsByFilter, createNewPoolsWithPoolGroup } from '~/engine/services/soccer/pools';
import { USER_ROLES, SPORTS_TYPES, POOL_STATUS } from '~/utils/constants';
import { assertAdmin } from '~/graphql/permissions';

class PoolGroupAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  // TODO: query should be changed with ref populate
  // TODO: separate APIs for admins and users
  readPoolGroups = async ({ sportsType }) => {
    try {
      const me = this.context.me;
      const isAdmin = me && (me.roles.includes(USER_ROLES.ADMIN) || me.roles.includes(USER_ROLES.SUPER_ADMIN));
      const match = isAdmin ? {
        'sportsType.name': sportsType
      } : {
        'sportsType.name': sportsType,
        enabled: true
      };
      const poolGroups = await this.context.models.poolGroupModel.
        aggregate().match(match).lookup({
          from: 'pools',
          let: { pgId: '$_id' },
          pipeline: [{
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$poolGroupId', '$$pgId']
                  },
                  isAdmin ?
                    {} :
                    {
                      $in: [
                        '$status',
                        [POOL_STATUS.OPENED]
                      ]
                    }
                ]
              }
            }
          }],
          as: 'pools'
        });
      const filteredPoolGroup = poolGroups.filter(poolGroup => {
        return isAdmin ? true : poolGroup.pools && poolGroup.pools.length > 0;
      });
      return filteredPoolGroup;
    } catch (error) {
      console.log('[graphql datasources poolGroupAPI readPoolGroups] error => ', error);
      return null;
    }
  };

  // TODO: separate APIs for admins and users
  readPoolGroup = async ({ _id, isAll = false }) => {
    try {
      const poolGroup = await this.context.models.poolGroupModel.findById({ _id });
      const me = this.context.me;
      const status = (me && (me.roles.includes(USER_ROLES.SUPER_ADMIN) || me.roles.includes(USER_ROLES.ADMIN))) || isAll ? (
        { $in: [POOL_STATUS.OPENED, POOL_STATUS.DISABLED, POOL_STATUS.PUBLISHED] }
      ) : (
        POOL_STATUS.OPENED
      );
      poolGroup.pools = await readPoolsByFilter({ poolGroupId: _id, status });
      return poolGroup;
    } catch (error) {
      console.log('[graphql datasources poolGroupAPI readPoolGroup] error => ', error);
      return [];
    }
  };

  disableOrEnablePoolGroup = async ({ _id, disabled }) => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const poolGroup = await this.context.models.poolGroupModel.findOneAndUpdate(
        { _id },
        { enabled: !disabled },
        { new: true }
      );
      return poolGroup;
    } catch (error) {
      console.log('[graphql datasources poolGroupAPI disableOrEnablePool] error => ', error);
      return [];
    }
  };

  deletePoolGroup = async _id => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const poolGroup = await this.context.models.poolGroupModel.deletePoolGroup({ _id });
      return poolGroup;
    } catch (error) {
      console.log('[graphql datasources poolGroupAPI deletePoolGroup] error => ', error);
    }
  };

  createOrUpdateSoccerPoolGroup = async poolGroup => {
    try {
      const newPoolGroup = {
        ...poolGroup,
        enabled: poolGroup._id ? poolGroup.enabled : true,
        sportsType: {
          name: SPORTS_TYPES.SOCCER
        }
      };
      let result = {};
      if (newPoolGroup._id) {
        result = await this.context.models.poolGroupModel.findOneAndUpdate(
          { _id: newPoolGroup._id },
          newPoolGroup,
          { new: true }
        );
      } else {
        result = await this.context.models.poolGroupModel.create({ ...newPoolGroup });
      }
      await createNewPoolsWithPoolGroup(result);
      const poolsByPoolGroupId = await readPoolsByFilter({ poolGroupId: result._id });
      console.log('[graphql datasources poolGroupAPI createOrUpdateSoccerPoolGroup] poolsByPoolGroupId => ', poolsByPoolGroupId);
      result.pools = poolsByPoolGroupId;
      return result;
    } catch (error) {
      console.log('[graphql datasources poolGroupAPI createOrUpdateSoccerPoolGroup] error => ', error);
    }
  };
}

export default PoolGroupAPI;
