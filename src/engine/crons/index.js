
import {
  resetCronJobForLeagues as resetSoccerCronJobForLeagues,
  startCronJobForLeagues as startSoccerCronJobForLeagues
} from './soccer/leagueCronJobs';
import {
  resetCronJobForFixtures as resetSoccerCronJobForFixtures,
  startCronJobForFixtures as startSoccerCronJobForFixtures
} from './soccer/fixtureCronJobs';
import {
  resetCronJobForPools as resetSoccerCronJobForPools,
  startCronJobForPools as startSoccerCronJobForPools
} from './soccer/poolCronJobs';

import {
  resetCronJobFroLiveScores as resetSoccerCronJobForLiveScores
} from './soccer/liveScoreCronJobs';

const startCronJobs = () => {
  startSoccerCronJobForLeagues();
  startSoccerCronJobForFixtures();
  startSoccerCronJobForPools();
};

export default startCronJobs;

export {
  resetSoccerCronJobForLeagues,
  resetSoccerCronJobForFixtures,
  resetSoccerCronJobForPools,
  resetSoccerCronJobForLiveScores
};
