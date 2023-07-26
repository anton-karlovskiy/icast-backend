/* eslint-disable require-jsdoc */

import requestPromise from 'request-promise';

import SoccerAPIInterface from '../interface';
import {
  parseLeagueResponse,
  parseFixtureResponse,
  parseLiveFixtureResponse,
  parseTeamResponse,
  parseFixtureStatsResponse
} from './parsers';

import {
  GOAL_SERVE_ROOT_PATH,
  GOAL_SERVE_SUFFIX_PATH,
  GOAL_SERVE_JSON_TYPE
} from '~/configs';

class SoccerAPI extends SoccerAPIInterface {
  constructor(apiKey) {
    super(apiKey);
  }

  readLeagues = async () => {
    try {
      const path =
        `${GOAL_SERVE_ROOT_PATH}` +
        `${this.apiKey}` +
        `${GOAL_SERVE_SUFFIX_PATH.SOCCER.LEAGUE}` +
        `?` +
        `${GOAL_SERVE_JSON_TYPE}`
      ;
      const options = {
        uri: path,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
      const response = await requestPromise(options);
      return parseLeagueResponse(response.fixtures);
    } catch (error) {
      console.log('[engine apis soccer goalserve SoccerAPI readLeagues] error => ', error);
      return [];
    }
  };

  readFixturesByLeague = async league => {
    try {
      const path =
        `${GOAL_SERVE_ROOT_PATH}` +
        `${this.apiKey}` +
        `${GOAL_SERVE_SUFFIX_PATH.SOCCER.FIXTURE_BY_LEAGUE}` +
        `/` +
        `${league.id}` +
        `?` +
        `${GOAL_SERVE_JSON_TYPE}`
      ;
      const options = {
        uri: path,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
      const response = await requestPromise(options);
      return parseFixtureResponse(league, { country: response.results['@country'], data: response.results.tournament });
    } catch (error) {
      console.log('[engine apis soccer goalserve SoccerAPI readFixturesByLeague] error.message => ', error.message);
      return [];
    }
  };

  getLiveFixturesByLeague = async league => {
    try {
      const path =
        `${GOAL_SERVE_ROOT_PATH}` +
        `${this.apiKey}` +
        `${GOAL_SERVE_SUFFIX_PATH.SOCCER.LIVE_FIXTURE}` +
        `?cat=` +
        `${league.id}` +
        `&` +
        `${GOAL_SERVE_JSON_TYPE}`
      ;
      const options = {
        uri: path,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
      const response = await requestPromise(options);
      return parseLiveFixtureResponse(response.scores.category);
    } catch (error) {
      console.log('[engine apis soccer goalserve SoccerAPI getLiveFixturesByLeague] error.message => ', error.message);
      return [];
    }
  };

  readTeamsByLeague = async league => {
    try {
      const path =
        `${GOAL_SERVE_ROOT_PATH}` +
        `${this.apiKey}` +
        `${GOAL_SERVE_SUFFIX_PATH.SOCCER.TEAM}` +
        `${league.id}` +
        `?` +
        `${GOAL_SERVE_JSON_TYPE}`
      ;
      const options = {
        uri: path,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
      const response = await requestPromise(options);
      return parseTeamResponse(response.league, league);
    } catch (error) {
      console.log('[engine apis soccer goalserve SoccerAPI readTeamsByLeague] error.message => ', error.message);
      return [];
    }
  };

  readSoccerFixtureStats = async ({ fixtureStaticId, leagueId }) => {
    const path =
      `${GOAL_SERVE_ROOT_PATH}` +
      `${this.apiKey}` +
      `${GOAL_SERVE_SUFFIX_PATH.SOCCER.FIXTURE_STATS}` +
      `?id=` +
      `${fixtureStaticId}` +
      `&league=` +
      `${leagueId}` +
      `&` +
      `${GOAL_SERVE_JSON_TYPE}`
    ;
    const options = {
      uri: path,
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    };
    const response = await requestPromise(options);
    return parseFixtureStatsResponse(response.commentaries);
  }
}

export default SoccerAPI;
