
// TODO: should double check if this cron job is necessary
import cron from 'node-cron';

import { CRON_SCHEDULES_FOR_UPDATE } from '~/configs';

const createCronJobForLiveScores = schedule => {
  return cron.schedule(schedule, () => {
    console.log('[engine crons soccer liveScoreCronJobs createCronJobForLiveScores] running live score schedule');
    // TODO: deprecated for now
    // updateFixturesLiveScoreFromSoccerAPI();
  });
};

let cronJobForLiveScores = createCronJobForLiveScores(CRON_SCHEDULES_FOR_UPDATE.LIVE_FIXTURE_CRON_SCHEDULE);

const resetCronJobForLiveScores = schedule => {
  cronJobForLiveScores.destroy();
  cronJobForLiveScores = createCronJobForLiveScores(schedule);
  cronJobForLiveScores.start();
};

const startCronJobForLiveScores = () => {
  cronJobForLiveScores.start();
};

export {
  resetCronJobForLiveScores,
  startCronJobForLiveScores
};
