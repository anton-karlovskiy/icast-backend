
// TODO: <
// TODO: double-check if it's needed
// TODO: >
require('dotenv').config();

const GOAL_SERVE_ROOT_PATH = 'https://www.goalserve.com/getfeed/';
const GOAL_SERVE_SUFFIX_PATH = {
  SOCCER: {
    LEAGUE: '/soccerfixtures/data/mapping',
    FIXTURE_BY_LEAGUE: '/soccerfixtures/league',
    LIVE_FIXTURE: '/soccernew/home',
    TEAM: '/soccerleague/',
    FIXTURE_STATS: '/commentaries/match'
  }
};

const GOAL_SERVE_JSON_TYPE = 'json=1';

const CRON_SCHEDULES_FOR_UPDATE = {
  FIXTURE_CRON_SCHEDULE: '0 0 2,9,16,23,30 * *',
  LEAGUE_CRON_SCHEDULE: '0 0 1,8,15,22,29 * *',
  POOL_CRON_SCHEDULE: '10 * * * *', // should be set schedule to avoid the period time of fixture cron schedule
  LIVE_FIXTURE_CRON_SCHEDULE: '1 * * * *' // should be set schedule to avoid the period time of fixture cron schedule
};

const CRON_SCHEDULES_FOR_RESET = {
  FIXTURE_CRON_SCHEDULE: '*/50 * * * * *',
  LEAGUE_CRON_SCHEDULE: '*/30 * * * * *'
};

const ENVIRONMENTS = {
  GOAL_SERVE_API_KEY: process.env.GOAL_SERVE_API_KEY
};

const NODE_ENV_TYPES = Object.freeze({
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
});

export {
  GOAL_SERVE_ROOT_PATH,
  GOAL_SERVE_SUFFIX_PATH,
  GOAL_SERVE_JSON_TYPE,
  CRON_SCHEDULES_FOR_UPDATE,
  CRON_SCHEDULES_FOR_RESET,
  ENVIRONMENTS,
  NODE_ENV_TYPES
};
