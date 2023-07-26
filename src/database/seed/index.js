
require('dotenv').config();
import mongoose from 'mongoose';

import sportsTypeModel from '~/database/models/sportsTypeModel';
import castingModel from '~/database/models/castingModel';
import poolTypeModel from '~/database/models/poolTypeModel';
import intervalModel from '~/database/models/intervalModel';
import { SPORTS_TYPES, POOL_TYPES, CASTING_TYPES } from '~/utils/constants';
import startSeedingSoccerData from './soccer';
import startSeedingUsers from './user';
import { getMongoURI } from '~/configs/mongodb';

mongoose
  .connect(getMongoURI(), {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log('[database seed] DB Connected!'))
  .catch(error => {
    console.log('[database seed] DB Connection error.message => ', error.message);
  });

const sportsTypeSeeds = [
  {
    name: SPORTS_TYPES.SOCCER
  },
  {
    name: SPORTS_TYPES.CRICKET
  },
  {
    name: SPORTS_TYPES.HORSE_RACING
  }
];

const castingTypeSeeds = [
  {
    specification: {
      castingType: CASTING_TYPES.SOCCER.EXACT_SCORE
    }
  },
  {
    specification: {
      castingType: CASTING_TYPES.SOCCER.DRAW
    }
  },
  {
    specification: {
      castingType: CASTING_TYPES.SOCCER.WINNER
    }
  },
  {
    specification: {
      castingType: CASTING_TYPES.SOCCER.OUTCOME
    }
  }
];

const poolTypeSeeds = [
  {
    name: POOL_TYPES.PAID
  },
  {
    name: POOL_TYPES.FREE
  }
];

const intervalSeeds = [
  {
    value: 259200
  },
  {
    value: 345600
  },
  {
    value: 432000
  },
  {
    value: 518400
  },
  {
    value: 604800
  },
  {
    value: 1209600
  }
];

const seedSportsTypes = async () => {
  for (const sportsTypeSeed of sportsTypeSeeds) {
    const existingSportsType = await sportsTypeModel.find({ name: sportsTypeSeed.name });
    if (!existingSportsType) {
      await sportsTypeModel.create({ ...sportsTypeSeed });
    }
  }
};

const seedPoolTypes = async () => {
  for (const poolTypeSeed of poolTypeSeeds) {
    const existingPoolType = await poolTypeModel.findOne({ name: poolTypeSeed.name });
    if (!existingPoolType) {
      await poolTypeModel.create({ ...poolTypeSeed });
    }
  }
};

const seedCastingTypes = async () => {
  for (const castingSeed of castingTypeSeeds) {
    const existingCasting = await castingModel.findOne({ 'specification.castingType': castingSeed.specification.castingType });
    if (!existingCasting) {
      await castingModel.create({ ...castingSeed });
    }
  }
};

const seedIntervals = async () => {
  for (const intervalSeed of intervalSeeds) {
    const existingInterval = await intervalModel.findOne({ value: intervalSeed.value });
    if (!existingInterval) {
      await intervalModel.create({ ...intervalSeed });
    }
  }
};

const startSeed = async () => {
  console.log('[database seed startSeed] start seeding');
  await seedSportsTypes();
  await seedCastingTypes();
  await seedPoolTypes();
  await seedIntervals();
  await startSeedingSoccerData();
  await startSeedingUsers();
  console.log('[database seed startSeed] end seeding');
};

startSeed();
