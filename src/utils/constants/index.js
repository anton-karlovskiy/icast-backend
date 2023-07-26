
// TODO: split into several files
const SPORTS_TERMS = {
  STAGE: 'stage',
  WEEK: 'week',
  AGGREGATE: 'aggregate',
  MATCH: 'match'
};

const SPORTS_TYPES = {
  ALL: 'ALL',
  SOCCER: 'SOCCER',
  CRICKET: 'CRICKET',
  HORSE_RACING: 'HORSE_RACING'
};

const RESOLVE_TYPES = {
  SOCCER: {
    FIXTURE: 'SoccerFixture',
    SCORING: 'SoccerScoring',
    POOL_GROUP: 'SoccerPoolGroup',
    CASTING: 'SoccerCasting',
    DISTRIBUTING: 'SoccerDistributing',
    TEAM: 'SoccerTeam',
    CAST_INFO: 'SoccerCastInfo'
  }
};

const POOL_TYPES = {
  PAID: 'PAID',
  FREE: 'FREE'
};

const CASTING_TYPES = {
  SOCCER: {
    EXACT_SCORE: 'EXACT_SCORE',
    DRAW: 'DRAW',
    WINNER: 'WINNER',
    OUTCOME: 'OUTCOME'
  }
};

const POOL_STATUS = {
  CREATED: 'CREATED',
  OPENED: 'OPENED',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED',
  DISABLED: 'DISABLED'
};

const DISPLAYING_CAST_TYPES = {
  TOP: 'Top',
  BOTTOM: 'Bottom'
};

const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  PAID_USER: 'PAID_USER',
  FREE_USER: 'FREE_USER'
};

const NODE_ENVS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development'
};

const COOKIE_ENVS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development'
};

const SCORING_ALGORITHMS = {
  DEFAULT: 'DEFAULT'
};

const DISTRIBUTING_TYPES = {
  PERCENTILE: 'PERCENTILE',
  PRIZE: 'PRIZE'
};

const SOCCER_FIXTURE_STATUS = {
  FULL_TIME: { name: 'FT', label: 'Full-time' },
  POSTPONED: { name: 'Postp', label: 'Postp' },
  TO_BE_ANNOUNCED: { name: 'TBA', label: 'To-be-announced' }
};

const PHONE_VERIFICATION_TYPE = {
  SMS: 'sms',
  CALL: 'call'
};

const PHONE_VERIFICATION_STATUS = {
  SIGNIN: 'SIGNIN',
  SIGNUP: 'SIGNUP',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CHANGE_PHONE_NUMBER: 'CHANGE_PHONE_NUMBER'
};

export {
  SPORTS_TYPES,
  POOL_TYPES,
  CASTING_TYPES,
  POOL_STATUS,
  SPORTS_TERMS,
  RESOLVE_TYPES,
  USER_ROLES,
  SCORING_ALGORITHMS,
  DISTRIBUTING_TYPES,
  DISPLAYING_CAST_TYPES,
  NODE_ENVS,
  COOKIE_ENVS,
  SOCCER_FIXTURE_STATUS,
  PHONE_VERIFICATION_TYPE,
  PHONE_VERIFICATION_STATUS
};
