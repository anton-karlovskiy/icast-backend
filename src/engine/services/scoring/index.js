
import castModel from '~/database/models/castModel';
import { SCORING_ALGORITHMS, SPORTS_TYPES, SOCCER_FIXTURE_STATUS } from '~/utils/constants';
import { checkValidNumber } from '~/utils/helpers';

const updateCastCollectionWithScoringResult = async poolId => {
  try {
    const casts = await castModel.find({ pool: poolId })
      .populate('user')
      .populate('pool')
      .populate('castInfos.fixture');

    if (casts.length === 0) {
      return;
    }
    for (const cast of casts) {
      let result = 0;
      switch (cast.pool.scoring) {
      case SCORING_ALGORITHMS.DEFAULT:
        result = getScoringResultWithDefaultAlgorithm(cast.castInfos, cast.pool.sportsType.name);
        break;
      default:
        break;
      }
      await castModel.findOneAndUpdate({ _id: cast._id }, { scoringResult: result });
    }
  } catch (error) {
    console.log('[engine services scoring updateCastCollectionWithScoringResult] error => ', error);
  }
};

const getScoringResultWithDefaultAlgorithm = (castInfos, sportsType) => {
  let result = 0;
  for (const castInfo of castInfos) {
    switch (sportsType) {
    case SPORTS_TYPES.SOCCER: {
      const actualGoalsHomeTeam =
        castInfo.fixture.status === SOCCER_FIXTURE_STATUS.FULL_TIME.name ?
          castInfo.fixture.specification.goalsHomeTeam :
          '';
      const actualGoalsAwayTeam =
        castInfo.fixture.status === SOCCER_FIXTURE_STATUS.FULL_TIME.name ?
          castInfo.fixture.specification.goalsAwayTeam :
          '';
      // TODO: exceptional fixtures should be excluded
      if (!checkValidNumber(actualGoalsHomeTeam) || !checkValidNumber(actualGoalsAwayTeam)) {
        continue;
      }
      const castGoalsHomeTeam = castInfo.specification.goalsHomeTeam;
      const castGoalsAwayTeam = castInfo.specification.goalsAwayTeam;
      const homeDiff = Math.pow(Math.abs(actualGoalsHomeTeam - castGoalsHomeTeam), 2);
      const awayDiff = Math.abs(actualGoalsAwayTeam - castGoalsAwayTeam);
      result += homeDiff + awayDiff;
      break;
    }
    default:
      break;
    }
  }
  return result;
};

export default updateCastCollectionWithScoringResult;
