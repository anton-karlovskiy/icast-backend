
require('dotenv').config();
import mongoose from 'mongoose';

import poolModel from '~/database/models/poolModel';
import { updateSoccerFixturesWithDummyScores } from '~/engine/services/soccer/pools';
import { SPORTS_TYPES } from '~/utils/constants';
import { getMongoURI } from '~/configs/mongodb';

mongoose
  .connect(getMongoURI(), {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('[database seed] DB Connected!');
    startSeed();
  })
  .catch(error => {
    console.log('[database seed] DB Connection error.message => ', error.message);
  });

// populate a certain pool's fixture's goalsHomeTeams and goalsAwayTeams with random scores for testing
const seedSoccerDummyScores = async () => {
  try {
    const documents = await poolModel.find({ 'sportsType.name': SPORTS_TYPES.SOCCER });
    if (!documents[0]) {
      console.log('[database seed test seedSoccerDummyScores] there are not any pools in pool collection');
      return;
    }
    await updateSoccerFixturesWithDummyScores(documents[0].toObject({ getters: true, virtuals: false }));
  } catch (error) {
    console.log('[database seed test seedSoccerDummyScores] error => ', error);
  }
};

const startSeed = async () => {
  console.log('[database seed test startSeed] start seeding');
  await seedSoccerDummyScores();
  console.log('[database seed test startSeed] end seeding');
};
