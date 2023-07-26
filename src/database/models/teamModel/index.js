
import mongoose from 'mongoose';

import soccerTeamSchema from './soccer';
import { SPORTS_TYPES } from '~/utils/constants';

const teamSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: String,
  logo: String,
  country: String,
  specification: soccerTeamSchema
}, { discriminatorKey: '__t' });

teamSchema.path('specification').discriminator(SPORTS_TYPES.SOCCER, soccerTeamSchema);

const teamModel = mongoose.model('team', teamSchema);

export default teamModel;
