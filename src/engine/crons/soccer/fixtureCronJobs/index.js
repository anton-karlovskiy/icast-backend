
import cron from 'node-cron';

import { updateFixtureCollectionFromAPI } from '~/engine/services/soccer/fixtures';
import { CRON_SCHEDULES_FOR_UPDATE } from '~/configs';

const createCronJobForFixtures = schedule => {
  return cron.schedule(schedule, () => {
    console.log('[engine crons soccer fixtureCronJobs createCronJobForFixtures] running fixture schedule');
    updateFixtureCollectionFromAPI();
  });
};

let cronJobForFixtures = createCronJobForFixtures(CRON_SCHEDULES_FOR_UPDATE.FIXTURE_CRON_SCHEDULE);

const resetCronJobForFixtures = schedule => {
  cronJobForFixtures.destroy();
  cronJobForFixtures = createCronJobForFixtures(schedule);
  cronJobForFixtures.start();
};

const startCronJobForFixtures = () => {
  cronJobForFixtures.start();
};

export {
  resetCronJobForFixtures,
  startCronJobForFixtures
};
