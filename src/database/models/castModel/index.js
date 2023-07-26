
import mongoose from 'mongoose';

import soccerCastInfoSchema from './soccer';
import { SPORTS_TYPES } from '~/utils/constants';
import { timeStamp } from '~/utils/helpers/database';

// TODO: refs (`fixture`, `user`, and `pool`) are hardcoded
const castInfoSchema = new mongoose.Schema({
  fixture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fixture',
    required: true
  },
  specification: soccerCastInfoSchema
}, { discriminatorKey: '__t' });

castInfoSchema.path('specification').discriminator(SPORTS_TYPES.SOCCER, soccerCastInfoSchema);

const castSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pool',
    required: true
  },
  stake: {
    type: Number,
    required: true
  },
  castInfos: [castInfoSchema],
  scoringResult: Number,
  distributingResult: {
    ranking: {
      type: Number
    },
    // TODO: could calculate this in resolver
    level: {
      type: String
    },
    money: {
      type: Number
    }
  }
});

castSchema.plugin(timeStamp);

const castModel = mongoose.model('cast', castSchema);

export default castModel;
