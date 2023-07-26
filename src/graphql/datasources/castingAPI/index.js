/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

class CastingAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readCastings = async () => {
    try {
      return await this.context.models.castingModel.find();
    } catch (error) {
      console.log('[graphql datasources castingAPI readCastings] error => ', error);
    }
  };
}

export default CastingAPI;
