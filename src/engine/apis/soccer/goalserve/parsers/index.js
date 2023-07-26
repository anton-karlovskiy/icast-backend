
import moment from 'moment';

import { SPORTS_TERMS, SPORTS_TYPES, SOCCER_FIXTURE_STATUS } from '~/utils/constants';
import { DATE_TIME_FORMAT, GOAL_SERVE_DATE_FORMAT, isValidDate } from '~/utils/helpers/dateTime';

const parseLeagueResponse = leagueResponse => {
  let results = [];
  if (leagueResponse && leagueResponse.mapping) {
    leagueResponse.mapping.forEach(league => {
      const parsedLeague = {
        id: league['@id'],
        country: league['@country'],
        name: league['@name'],
        sportsType: {
          name: SPORTS_TYPES.SOCCER
        },
        season: league['@season'],
        startDate: moment.utc(league['@date_start'], GOAL_SERVE_DATE_FORMAT),
        endDate: moment.utc(league['@date_end'], GOAL_SERVE_DATE_FORMAT)
      };
      results = [...results, parsedLeague];
    });
  }
  return results;
};

const convertMatchToFixture = (league, country, match) => ({
  id: match['@id'] ? match['@id'] : 0,
  eventDate: getDate(`${match['@date']} ${match['@time']}`),
  status: match['@status'],
  specification: {
    staticId: match['@static_id'],
    league,
    homeTeam: {
      id: match.localteam['@id'],
      name: match.localteam['@name'],
      code: match.localteam['@id'],
      country
    },
    awayTeam: {
      id: match.visitorteam['@id'],
      name: match.visitorteam['@name'],
      code: match.visitorteam['@id'],
      country
    },
    goalsHomeTeam: match.localteam['@score'],
    goalsAwayTeam: match.visitorteam['@score']
  }
});

const convertToFixtures = (league, country, data) => {
  let results = [];
  for (const key in data) {
    if ([SPORTS_TERMS.STAGE, SPORTS_TERMS.WEEK, SPORTS_TERMS.AGGREGATE].includes(key)) {
      const children = data[key];
      if (Array.isArray(children)) {
        children.forEach(child => {
          const fixtures = convertToFixtures(league, country, child);
          results = [...results, ...fixtures];
        });
      } else {
        const fixtures = convertToFixtures(league, country, children);
        results = [...results, ...fixtures];
      }
    } else if (key === SPORTS_TERMS.MATCH) {
      const newData = data[key];
      if (Array.isArray(newData)) {
        newData.forEach(match => {
          const fixture = convertMatchToFixture(league, country, match);
          results = [...results, fixture];
        });
      } else {
        const fixture = convertMatchToFixture(league, country, newData);
        results = [...results, fixture];
      }
    }
  }
  return results;
};

const parseFixtureResponse = (league, fixtureResponse) => {
  const results = convertToFixtures(league, fixtureResponse.country, fixtureResponse.data);
  return results;
};

const parseLiveFixtureResponse = liveFixtureResponse => {
  let results = [];

  if (!liveFixtureResponse || !liveFixtureResponse.matches || !liveFixtureResponse.matches.match) {
    return results;
  }
  const matches = liveFixtureResponse.matches;
  if (Array.isArray(matches.match)) {
    for (const match of matches.match) {
      const fixture = {
        id: match['@fix_id'],
        status: match['@status'],
        goalsHomeTeam: match.localteam['@goals'],
        goalsAwayTeam: match.visitorteam['@goals']
      };
      results = [...results, fixture];
    }
  } else {
    const fixture = {
      id: matches.match['@fix_id'],
      status: matches.match['@status'],
      goalsHomeTeam: matches.match.localteam['@goals'],
      goalsAwayTeam: matches.match.visitorteam['@goals']
    };
    results = [...results, fixture];
  }
  return results;
};

const parseTeamResponse = (teamResponse, league) => {
  let results = [];
  if (Array.isArray(teamResponse.team)) {
    for (const team of teamResponse.team) {
      const result = {
        id: team['@id'] || 0,
        name: team['@name'] || '',
        country: teamResponse['@country'] || '',
        specification: {
          league
        }
      };
      results = [...results, result];
    }
  } else {
    const result = {
      id: teamResponse.team['@id'] || 0,
      name: teamResponse.team['@name'] || '',
      country: teamResponse.team['@country'] || '',
      specification: {
        league
      }
    };
    results = [...results, result];
  }
  return results;
};

const getDate = date => {
  let convertedDate;
  if (date) {
    const year = date.split(' ')[0].split('.')[2];
    const month = date.split(' ')[0].split('.')[1];
    const day = date.split(' ')[0].split('.')[0];
    const hour = date.split(' ')[1].split(':')[0];
    const min = date.split(' ')[1].split(':')[1];

    const newDate = `${year}-${month}-${day} ${hour}:${min}:00`;
    if (isValidDate(newDate)) {
      convertedDate = moment.utc(newDate, DATE_TIME_FORMAT);
    } else {
      convertedDate = moment('1100-01-01').format(DATE_TIME_FORMAT);
    }
  } else {
    convertedDate = moment('1100-01-01').format(DATE_TIME_FORMAT);
  }

  return convertedDate;
};

const parseFixtureStatsResponse = data => {
  let result = {};
  if (data.tournament && data.tournament.match) {
    result = {
      id: data.tournament.match['@id'],
      status:
        data.tournament.match['@status'] === SOCCER_FIXTURE_STATUS.FULL_TIME.label ?
          SOCCER_FIXTURE_STATUS.FULL_TIME.name :
          data.tournament.match['@status'],
      goalsHomeTeam: data.tournament.match.localteam['@goals'],
      goalsAwayTeam: data.tournament.match.visitorteam['@goals']
    };
  }
  return result;
};

export {
  parseLeagueResponse,
  parseFixtureResponse,
  parseLiveFixtureResponse,
  parseTeamResponse,
  parseFixtureStatsResponse
};
