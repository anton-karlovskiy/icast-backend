
import mongoose from 'mongoose';

import soccerFixtureSchema from './soccer';
import { SPORTS_TYPES } from '~/utils/constants';

const fixtureSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  eventDate: Date,
  status: String,
  specification: soccerFixtureSchema
}, { discriminatorKey: '__t' });

fixtureSchema.path('specification').discriminator(SPORTS_TYPES.SOCCER, soccerFixtureSchema);

const fixtureModel = mongoose.model('fixture', fixtureSchema);

export default fixtureModel;
