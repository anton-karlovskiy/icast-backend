/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

import { updateFixtureCollectionFromAPIByLeague, updateFixtureCollectionFromAPI } from '~/engine/services/soccer/fixtures';
import { assertAdmin } from '~/graphql/permissions';

class LeagueAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readLeagues = async ({ country }) => {
    try {
      const condition = country ? { country } : {};
      return await this.context.models.leagueModel.find(condition);
    } catch (error) {
      console.log('[graphql datasources leagueAPI readLeagues] error => ', error);
    }
  };

  readLeaguesGroupByCountries = async () => {
    try {
      const countries = await this.context.models.leagueModel.aggregate().group({
        _id: '$country',
        id: { $first: '$id' },
        name: { $first: '$name' },
        country: { $first: '$country' }
      });
      return countries;
    } catch (error) {
      console.log('[graphql datasources leagueAPI readLeaguesGroupByCountries] error => ', error);
    }
  };

  syncLeague = async ({ leagueId }) => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const league = await this.context.models.leagueModel.findOne({ _id: leagueId }).exec();
      updateFixtureCollectionFromAPIByLeague(league);
      return leagueId;
    } catch (error) {
      console.log('[graphql datasources leagueAPI syncLeague] error => ', error);
      return '';
    }
  };

  syncAllLeagues = async () => {
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      updateFixtureCollectionFromAPI();
      return true;
    } catch (error) {
      console.log('[graphql datasources leagueAPI syncAllLeague] error => ', error);
      return false;
    }
  };
}

export default LeagueAPI;
