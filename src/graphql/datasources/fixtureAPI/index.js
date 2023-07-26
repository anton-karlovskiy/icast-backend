/* eslint-disable require-jsdoc */

import { DataSource } from 'apollo-datasource';
import moment from 'moment';

import { DATE_TIME_FORMAT, END_TIME } from '~/utils/helpers/dateTime';
import { getObjectId } from '~/utils/helpers/database';
import { updateFixtureCollectionFromAPIByLeague } from '~/engine/services/soccer/fixtures';

class FixtureAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readFixtures = async ({ sportsType, filters }) => {
    try {
      if (filters) {
        let skipFixtureIds = [];
        filters && filters.skipFixtureIds && filters.skipFixtureIds.forEach(skipFixtureId => {
          skipFixtureIds = [...skipFixtureIds, getObjectId(skipFixtureId)];
        });
        const leagueFilterCondition = filters && filters.leagueIds ? {
          'specification.league.id': { $in: filters.leagueIds }
        } : {};
        const fixtures = await this.context.models.fixtureModel.find({
          _id: {
            $nin: skipFixtureIds
          },
          eventDate: {
            $gte: moment(filters.startDate, DATE_TIME_FORMAT),
            $lte: moment(`${filters.endDate} ${END_TIME}`, DATE_TIME_FORMAT)
          },
          'specification.__t': sportsType,
          ...leagueFilterCondition
        });
        return fixtures;
      } else {
        const fixtures = await this.context.models.fixtureModel.find({
          'specification.__t': sportsType
        });
        return fixtures;
      }
    } catch (error) {
      console.log('[graphql datasources fixtureAPI readFixtures] error => ', error);
    }
  };

  addFixturesFromAPIByLeague = async ({ leagueId }) => {
    try {
      const league = await this.context.models.leagueModel.findOne({ id: leagueId }).exec();
      await updateFixtureCollectionFromAPIByLeague(league);
      return true;
    } catch (error) {
      console.log('[graphql datasources fixtureAPI addFixturesFromAPIByLeague] error => ', error);
      return false;
    }
  };

  readUpcomingFixturesByLeague = async ({ leagueId }) => {
    try {
      const fixtures = await this.context.models.fixtureModel.find({
        'specification.league._id': getObjectId(leagueId),
        eventDate: {
          $gte: moment(new Date(), DATE_TIME_FORMAT)
        }
      }).sort({
        eventDate: 1,
        _id: 1
      });
      return fixtures;
    } catch (error) {
      console.log('[graphql datasources fixtureAPI readUpcomingFixturesByLeague] => error => ', error);
      return [];
    }
  };
}

export default FixtureAPI;
