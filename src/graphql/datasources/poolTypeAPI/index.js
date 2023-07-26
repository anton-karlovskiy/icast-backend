/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

class PoolTypeAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readPoolTypes = async () => {
    try {
      return await this.context.models.poolTypeModel.find();
    } catch (error) {
      console.log('[graphql datasources poolTypeAPI readPoolTypes] error => ', error);
      return null;
    }
  };
}

export default PoolTypeAPI;
