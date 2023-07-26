/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

class IntervalAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readIntervals = async () => {
    try {
      return await this.context.models.intervalModel.find();
    } catch (error) {
      console.log('[graphql datasources intervalAPI getInterval] error => ', error);
      return [];
    }
  };
}

export default IntervalAPI;
