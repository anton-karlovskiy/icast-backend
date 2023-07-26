
import moment from 'moment';

import fixtureModel from '~/database/models/fixtureModel';
import poolModel from '~/database/models/poolModel';
import SoccerAPI from '~/engine/apis/soccer/goalserve';
import { DATE_TIME_FORMAT, END_TIME, getPeriodDates } from '~/utils/helpers/dateTime';
import { generatePool, sortFixturesByPreferredTeams } from '~/utils/helpers';
import { getObjectId } from '~/utils/helpers/database';
import { SOCCER_FIXTURE_STATUS, POOL_STATUS } from '~/utils/constants';
import { ENVIRONMENTS } from '~/configs';

const soccerAPI = new SoccerAPI(ENVIRONMENTS.GOAL_SERVE_API_KEY);

/**
 * update fixtures of pool collections in MongoDB
 */
const updatePoolCollection = async () => {
  try {
    const pools = await poolModel.find({ status: { $ne: POOL_STATUS.PUBLISHED } });
    for (const pool of pools) {
      for (const fixture of pool.fixtures) {
        if (fixture.status !== SOCCER_FIXTURE_STATUS.FULL_TIME.name) {
          const fixtureStats =
            await soccerAPI.readSoccerFixtureStats({
              fixtureStaticId: fixture.specification.staticId,
              leagueId: fixture.specification.league.id
            });
          if (fixtureStats.id) {
            console.log('[updatePoolCollection] fixtureId, status => ', fixtureStats.id, fixtureStats.status);
            const newFixture = await fixtureModel.findOneAndUpdate({
              id: fixtureStats.id
            }, {
              status: fixtureStats.status,
              'specification.goalsHomeTeam': fixtureStats.goalsHomeTeam,
              'specification.goalsAwayTeam': fixtureStats.goalsAwayTeam
            }, {
              new: true
            });
            await poolModel.update({ _id: pool._id, 'fixtures.id': newFixture.id }, {
              $set: {
                'fixtures.$.status': newFixture.status,
                'fixtures.$.specification': newFixture.specification
              }
            });
          }
        }
      }
    }
  } catch (error) {
    console.log('[engine services soccer pools updatePoolCollection] error => ', error);
  }
};

/**
 * create a new pool collection with created poolGroup
 * @param {Object} poolGroup - object created by admin
 */
const createNewPoolsWithPoolGroup = async poolGroup => {
  try {
    if (!poolGroup) {
      return;
    }
    const filter = {
      poolGroupId: poolGroup._id
    };
    await poolModel.deleteMany(filter);
    const periodDates = getPeriodDates(poolGroup.startDate, poolGroup.endDate, poolGroup.interval.value);
    for (const periodDate of periodDates) {
      let fixtures = [];
      for (const league of poolGroup.specification.leagues) {
        const fixturesFromDB = await fixtureModel
          .find({
            'specification.league.id': league.id,
            eventDate: {
              $gte: moment(periodDate.startDate, DATE_TIME_FORMAT),
              $lte: moment(`${periodDate.endDate} ${END_TIME}`, DATE_TIME_FORMAT)
            }
          });
        fixtures = [...fixtures, ...fixturesFromDB];
      }
      fixtures = sortFixturesByPreferredTeams(fixtures, poolGroup.preferredTeams);
      fixtures = fixtures.sort((a, b) => b.eventDate - a.eventDate);
      fixtures = fixtures.slice(0, poolGroup.maxFixtureCount);
      const pool = generatePool({ fixtures, poolGroup, periodDate });
      await poolModel.create({ ...pool });
    }
  } catch (error) {
    console.log('[engine services soccer pools createNewPoolsWithPoolGroup] error => ', error);
  }
};

const readPoolsByFilter = async filter => {
  try {
    return await poolModel.find({ ...filter });
  } catch (error) {
    console.log('[engine services soccer pools readPoolsByFilter] error => ', error);
  }
};

const updateSoccerFixturesWithDummyScores = async pool => {
  try {
    const module = await import('chance');
    const Chance = module.default;
    const chance = new Chance();
    let newFixtures = [];
    for (const fixture of pool.fixtures) {
      const newFixture = {
        ...fixture,
        specification: {
          ...fixture.specification,
          goalsHomeTeam: String(chance.d10()),
          goalsAwayTeam: String(chance.d10())
        }
      };
      await fixtureModel.findByIdAndUpdate(
        getObjectId(fixture._id),
        {
          'specification.goalsHomeTeam': newFixture.specification.goalsHomeTeam,
          'specification.goalsAwayTeam': newFixture.specification.goalsAwayTeam
        },
        { new: true }
      );
      newFixtures = [...newFixtures, newFixture];
    }
    // TODO: once we've fixed database model relationship based on ref, the following line should be removed
    await poolModel.findOneAndUpdate({ _id: pool._id }, { fixtures: newFixtures });
  } catch (error) {
    console.log('[engine services soccer pools updatePoolCollectionWithDummyScores] error => ', error);
  }
};

export {
  updatePoolCollection,
  createNewPoolsWithPoolGroup,
  readPoolsByFilter,
  updateSoccerFixturesWithDummyScores
};
