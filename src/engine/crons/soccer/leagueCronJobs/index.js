
import cron from 'node-cron';

import { updateLeagueCollectionFromAPI } from '~/engine/services/soccer/leagues';
import { CRON_SCHEDULES_FOR_UPDATE } from '~/configs';

const createCronJobForLeagues = schedule => {
  return cron.schedule(schedule, () => {
    console.log('[engine crons soccer leagueCronJobs createCronJobForLeagues] running league schedule');
    updateLeagueCollectionFromAPI();
  });
};

let cronJobForLeagues = createCronJobForLeagues(CRON_SCHEDULES_FOR_UPDATE.LEAGUE_CRON_SCHEDULE);

const resetCronJobForLeagues = schedule => {
  cronJobForLeagues.destroy();
  cronJobForLeagues = createCronJobForLeagues(schedule);
  cronJobForLeagues.start();
};

const startCronJobForLeagues = () => {
  cronJobForLeagues.start();
};

export {
  resetCronJobForLeagues,
  startCronJobForLeagues
};
