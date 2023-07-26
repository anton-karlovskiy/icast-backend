/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';

class TeamAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readTeamsByLeague = async ({ leagueId }) => {
    try {
      return await this.context.models.teamModel.find({ 'specification.league.id': leagueId });
    } catch (error) {
      console.log('[graphql datasources teamAPI readTeamsByLeague] error => ', error);
      return null;
    }
  };
}

export default TeamAPI;
