
import { updateLeagueCollectionFromAPI } from '~/engine/services/soccer/leagues';
import { updateFixtureCollectionFromAPI } from '~/engine/services/soccer/fixtures';
import { updateTeamCollectionFromAPI } from '~/engine/services/soccer/teams';

const startSeedingSoccerData = async () => {
  await updateLeagueCollectionFromAPI();
  await updateTeamCollectionFromAPI();
  await updateFixtureCollectionFromAPI();
};

export default startSeedingSoccerData;
