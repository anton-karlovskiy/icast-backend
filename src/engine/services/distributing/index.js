
import castModel from '~/database/models/castModel';
import { DISTRIBUTING_TYPES } from '~/utils/constants';

const updateCastCollectionWithDistributingResult = async poolId => {
  try {
    const casts = await castModel.find({ pool: poolId })
      .populate('user')
      .populate('pool')
      .populate('castInfos.fixture')
      .lean()
      .exec();
    if (casts.length === 0) {
      return;
    }
    const rankOrderedCasts = casts.sort((a, b) => Number(a.scoringResult) - Number(b.scoringResult));
    let newCasts = [];
    const pool = casts[0].pool;
    if (pool.distributing.type === DISTRIBUTING_TYPES.PRIZE) {
      newCasts = generateDistributingResultWithPrizes(rankOrderedCasts, pool.distributing);
    } else if (pool.distributing.type === DISTRIBUTING_TYPES.PERCENTILE) {
      newCasts = generateDistributingResultWithPercentiles(rankOrderedCasts, pool.distributing);
    }
    for (const newCast of newCasts) {
      console.log(
        '[updateCastCollectionWithDistributingResult] distributing results => ',
        `${newCast.distributingResult.ranking} ${newCast.distributingResult.level} ${newCast.distributingResult.money}`
      );
      await castModel.findOneAndUpdate({ _id: newCast._id }, { distributingResult: newCast.distributingResult });
    }
  } catch (error) {
    console.log('[engine services distributing updateCastCollectionWithDistributingResult] error => ', error);
  }
};

const generateDistributingResultWithPrizes = (casts, distributing) => {
  const newCasts = casts.map((cast, index) => {
    const prize = distributing.prizes.find(prize => index + 1 === prize.ranking) || {};
    const distributingResult = {
      ranking: prize.ranking,
      money: prize.amount,
      level: getOrdinalSuffix(prize.ranking)
    };
    return {
      ...cast,
      distributingResult
    };
  });
  return newCasts;
};

const generateDistributingResultWithPercentiles = (casts, distributing) => {
  let sumOfMoney = 0;
  const percentiles = distributing.percentiles.sort((a, b) => a.ranking - b.ranking);
  let scoringResults = casts.map(cast => cast.scoringResult);
  scoringResults = scoringResults.sort((a, b) => a - b);
  let distributingValues = [];
  percentiles.forEach((percentile, index) => {
    const percentileValue = index === 0 ? (
      percentile.threshold / 100
    ) : (
      percentile.threshold / 100 + distributingValues[distributingValues.length - 1].percentile
    );
    const distributingValue = {
      ranking: percentile.ranking,
      threshold: percentile.threshold,
      slab: percentile.slab,
      percentile: percentileValue,
      calculatedValueAtPercentile: getCalculatedValueAtPercentile(scoringResults, percentileValue)
    };
    distributingValues = [...distributingValues, distributingValue];
  });

  const newCasts = casts.map(cast => {
    sumOfMoney += cast.stake;
    const distributingValueForCast = distributingValues.find((distributingValue, index) => {
      return distributingValue.calculatedValueAtPercentile > cast.scoringResult;
    });
    return {
      ...cast,
      distributingResult: {
        ranking: distributingValueForCast.ranking,
        level:
          getLevelFromPercentileThreshold(
            percentiles.length,
            distributingValueForCast.ranking,
            distributingValueForCast.threshold
          )
      }
    };
  });

  const disbursableMoney = sumOfMoney * distributing.potSize / 100;
  let distributedCasts = [];

  distributingValues.forEach(distributingValue => {
    let sumOfExchangedStakes = 0;
    let sumOfScoringResult = 0;
    const castsWithSameDistributingLevel = newCasts.filter(newCast => {
      if (distributingValue.ranking === newCast.distributingResult.ranking) {
        sumOfScoringResult += newCast.scoringResult;
        return true;
      }
      return false;
    });

    castsWithSameDistributingLevel.forEach(castWithSameDistributingLevel => {
      sumOfExchangedStakes += castsWithSameDistributingLevel.length > 1 ? (
        (sumOfScoringResult - castWithSameDistributingLevel.scoringResult) * castWithSameDistributingLevel.stake
      ) : (
        castWithSameDistributingLevel.scoringResult * castWithSameDistributingLevel.stake
      );
    });
    const slabMoney = disbursableMoney * distributingValue.slab / 100;
    for (const castWithSameDistributingLevel of castsWithSameDistributingLevel) {
      const exchangedStake = castsWithSameDistributingLevel.length > 1 ? (
        castWithSameDistributingLevel.stake * (sumOfScoringResult - castWithSameDistributingLevel.scoringResult)
      ): (
        castWithSameDistributingLevel.stake * castWithSameDistributingLevel.scoringResult
      );
      const money = (exchangedStake / sumOfExchangedStakes * slabMoney).toFixed(2);
      const distributedCast = {
        ...castWithSameDistributingLevel,
        distributingResult: {
          ...castWithSameDistributingLevel.distributingResult,
          money
        }
      };
      distributedCasts = [...distributedCasts, distributedCast];
    }
  });
  return distributedCasts;
};

const getLevelFromPercentileThreshold = (count, ranking, threshold) => {
  if (ranking === 1) {
    return `Top ${threshold}%`;
  } else if (ranking === count) {
    return `Last ${threshold}%`;
  } else {
    return `Next ${threshold}%`;
  }
};

const getCalculatedValueAtPercentile = (scoringResults, percentileValue) => {
  if (scoringResults.length === 0) return 0;
  if (typeof percentileValue !== 'number') throw new TypeError('percentileValue must be a number');
  if (percentileValue >= 1) return scoringResults[scoringResults.length - 1] + 1;

  const index = (scoringResults.length + 1) * percentileValue - 1;
  if (index < 0) return 0;
  const lower = Math.floor(index);
  const upper = lower + 1;
  const weight = index % 1;
  const result =
    upper >= scoringResults.length ?
      scoringResults[lower] + 1 :
      scoringResults[lower] * (1 - weight) + scoringResults[upper] * weight + 1;
  return result;
};

const getOrdinalSuffix = number => {
  if (!number) {
    return '';
  }
  const remainderOfTenDivision = number % 10;
  const remainderOfHundredDivision = number % 100;
  if (remainderOfTenDivision === 1 && remainderOfHundredDivision !== 11) {
    return number + 'st';
  }
  if (remainderOfTenDivision === 2 && remainderOfHundredDivision !== 12) {
    return number + 'nd';
  }
  if (remainderOfTenDivision === 3 && remainderOfHundredDivision !== 13) {
    return number + 'rd';
  }
  return number + 'th';
};

export default updateCastCollectionWithDistributingResult;
