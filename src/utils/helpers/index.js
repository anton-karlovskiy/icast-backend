
import { POOL_STATUS } from '~/utils/constants';

const generatePool = ({ fixtures, poolGroup, periodDate }) => {
  const result = {
    poolGroupId: poolGroup._id,
    name: poolGroup.prefix,
    fixtures,
    startDate: periodDate.startDate,
    endDate: periodDate.endDate,
    sportsType: poolGroup.sportsType,
    status: POOL_STATUS.OPENED
  };
  return result;
};

const sortFixturesByPreferredTeams = (fixtures, preferredTeams) => {
  let sortedFixtures = [];
  let preferredTeamIds = [];
  if (!preferredTeams || preferredTeams.length === 0) {
    return fixtures;
  }
  for (const preferredTeam of preferredTeams) {
    preferredTeamIds = [...preferredTeamIds, preferredTeam.id];
  }
  sortedFixtures = fixtures.sort((a, b) => {
    if (preferredTeamIds.includes(a.specification.homeTeam.id) || preferredTeamIds.includes(a.specification.awayTeam.id)) {
      return 1;
    } else {
      if (preferredTeamIds.includes(b.specification.homeTeam.id) || preferredTeamIds.includes(b.specification.awayTeam.id)) {
        return -1;
      } else {
        return 1;
      }
    }
  });
  return sortedFixtures;
};

const checkValidNumber = number => {
  return number !== '' && !isNaN(number);
};

const getPageInfo = ({ total, offset, limit }) => {
  if (!limit) {
    return null;
  }
  const hasNext = limit && (total > (offset + limit));
  const pageInfo = {
    total,
    currentPage: offset / limit,
    limit,
    hasNext
  };
  return pageInfo;
};

const getElementsOfArray = ({ array, number, sort }) => {
  if (!array) {
    return [];
  }
  if (!number) {
    return sort === 1 ? array[0] : array[array.length - 1];
  }
  return sort === 1 ? array.slice(0, number) : array.slice(Math.max(array.length - number, 0));
};

export {
  generatePool,
  sortFixturesByPreferredTeams,
  checkValidNumber,
  getPageInfo,
  getElementsOfArray
};
