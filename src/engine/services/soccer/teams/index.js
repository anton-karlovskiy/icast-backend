
import leagueModel from '~/database/models/leagueModel';
import teamModel from '~/database/models/teamModel';
import SoccerAPI from '~/engine/apis/soccer/goalserve';
import { SPORTS_TYPES } from '~/utils/constants';
import { ENVIRONMENTS } from '~/configs';

const soccerAPI = new SoccerAPI(ENVIRONMENTS.GOAL_SERVE_API_KEY);

/**
 * update team collection in MongoDB with the result from soccer API
 */
const updateTeamCollectionFromAPI = async () => {
  try {
    const leagues = await leagueModel.find({ 'sportsType.name': SPORTS_TYPES.SOCCER }).sort({ id: 1 }); // ascending sorting
    if (!leagues) {
      return;
    }
    for (const league of leagues) {
      const teams = await soccerAPI.readTeamsByLeague(league);
      console.log('[engine services soccer teams updateTeamCollectionFromAPI] teams =>', teams);
      for (const team of teams) {
        const existingTeam = await teamModel.findOne({ id: team.id, 'specification.league.id': league.id });
        if (!existingTeam) {
          await teamModel.create({ ...team });
        }
      }
    }
  } catch (error) {
    console.log('[engine services soccer teams updateTeamCollectionFromAPI] error => ', error);
  }
};

export {
  updateTeamCollectionFromAPI
};
