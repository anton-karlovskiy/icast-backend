
import leagueModel from '~/database/models/leagueModel';
import fixtureModel from '~/database/models/fixtureModel';
import SoccerAPI from '~/engine/apis/soccer/goalserve';
import { syncLeague, unsyncLeague } from '~/engine/services/league';
import { SPORTS_TYPES } from '~/utils/constants';
import { ENVIRONMENTS } from '~/configs';

// TODO: could be API key to SoccerAPI
const soccerAPI = new SoccerAPI(ENVIRONMENTS.GOAL_SERVE_API_KEY);

/**
 * update fixture collection in MongoDB with the result from soccer API
 */
const updateFixtureCollectionFromAPI = async () => {
  try {
    const leagues = await leagueModel.find({ 'sportsType.name': SPORTS_TYPES.SOCCER });
    if (!leagues) {
      return;
    }
    for (const league of leagues) {
      syncLeague({ leagueId: league._id });
      await updateFixtureCollectionFromAPIByLeague(league);
      unsyncLeague({ leagueId: league._id });
    }
  } catch (error) {
    console.log('[engine services soccer fixtures updateFixtureCollectionFromAPI] error => ', error);
  }
};

/**
 * update the statues, goalsHomeTeam and goalsAwayTeam of fixture collection in MongoDB
 * with the live score data of today from soccer API
 */
const updateFixturesLiveScoreFromSoccerAPI = async () => {
  try {
    const leagues = await leagueModel.find({ 'sportsType.name': SPORTS_TYPES.SOCCER });
    for (const league of leagues) {
      const liveFixtures = await soccerAPI.getLiveFixturesByLeague(league);
      for (const liveFixture of liveFixtures) {
        await fixtureModel.findOneAndUpdate({
          id: liveFixture.id
        }, {
          status: liveFixture.status,
          'specification.goalsHomeTeam': liveFixture.goalsHomeTeam,
          'specification.goalsAwayTeam': liveFixture.goalsAwayTeam
        });
        console.log(
          '[updateFixturesLiveScoreFromSoccerAPI] updated fixture with live score. liveFixture => ',
          liveFixture
        );
      }
    }
  } catch (error) {
    console.log('[engine services soccer fixtures updateFixturesLiveScoreFromSoccerAPI] error => ', error);
  }
};

const updateFixtureCollectionFromAPIByLeague = async league => {
  try {
    syncLeague({ leagueId: league._id });
    const fixtures = await soccerAPI.readFixturesByLeague(league);
    for (const fixture of fixtures) {
      const existingFixture = await fixtureModel.findOne({ id: fixture.id });
      if (existingFixture) {
        if (existingFixture.status === fixture.status) {
          console.log(
            '[updateFixtureCollectionFromAPIByLeague] existing fixture, skipped. existing fixture id, league id => ',
            fixture.id, league.id
          );
        } else {
          await fixtureModel.findOneAndUpdate({ id: fixture.id }, { ...fixture });
          console.log(
            '[updateFixtureCollectionFromAPIByLeague] updated fixtures, fixture id, league id => ',
            fixture.id,
            league.id
          );
        }
      } else {
        await fixtureModel.create({ ...fixture });
        console.log(
          '[updateFixtureCollectionFromAPIByLeague] saved fixture.id, league.id => ',
          fixture.id,
          league.id
        );
      }
    }
    unsyncLeague({ leagueId: league._id });
  } catch (error) {
    console.log('[engine services soccer fixtures updateFixtureCollectionFromAPIByLeague] error => ', error);
  }
};

export {
  updateFixtureCollectionFromAPI,
  updateFixturesLiveScoreFromSoccerAPI,
  updateFixtureCollectionFromAPIByLeague
};
