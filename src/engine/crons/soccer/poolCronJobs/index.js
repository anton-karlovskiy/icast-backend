
import cron from 'node-cron';

import { updatePoolCollection } from '~/engine/services/soccer/pools';
import { CRON_SCHEDULES_FOR_UPDATE } from '~/configs';

const createCronJobForPools = schedule => {
  return cron.schedule(schedule, () => {
    console.log('[engine crons soccer poolCronJobs createCronJobForPools] running pools schedule');
    updatePoolCollection();
  });
};

let cronJobForPools = createCronJobForPools(CRON_SCHEDULES_FOR_UPDATE.POOL_CRON_SCHEDULE);

const resetCronJobForPools = schedule => {
  cronJobForPools.stop();
  cronJobForPools = createCronJobForPools(schedule);
  cronJobForPools.start();
};

const startCronJobForPools = () => {
  cronJobForPools.start();
};

export {
  resetCronJobForPools,
  startCronJobForPools
};
