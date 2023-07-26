
import leagueModel from '~/database/models/leagueModel';
import SoccerAPI from '~/engine/apis/soccer/goalserve';
import { ENVIRONMENTS } from '~/configs';

const soccerAPI = new SoccerAPI(ENVIRONMENTS.GOAL_SERVE_API_KEY);

/**
 * update league collection in MongoDB with the result from Soccer API
 */
const updateLeagueCollectionFromAPI = async () => {
  try {
    const leagues = await soccerAPI.readLeagues();
    for (const league of leagues) {
      const existingLeague = await leagueModel.findOne({ id: league.id });
      if (!existingLeague) {
        console.log('[engine services soccer leagues updateLeagueCollectionFromAPI] create a new league');
        await leagueModel.create({ ...league });
      }
    }
  } catch (error) {
    console.log('[engine services soccer leagues updateLeagueCollectionFromAPI] error => ', error);
  }
};

export {
  updateLeagueCollectionFromAPI
};
