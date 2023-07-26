
import mongoose from 'mongoose';

import sportsTypeModel from '~/database/models/sportsTypeModel';
import castingModel from '~/database/models/castingModel';
import poolTypeModel from '~/database/models/poolTypeModel';
import intervalModel from '~/database/models/intervalModel';
import teamModel from '~/database/models/teamModel';
import poolModel from '~/database/models/poolModel';
import castModel from '~/database/models/castModel';
import soccerPoolGroupSchema from './soccer';
import distributingSchema from '~/database/models/distributingSchema';
import { SPORTS_TYPES } from '~/utils/constants';
import { SCORING_ALGORITHMS } from '~/utils/constants';

const poolGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: true
  },
  sportsType: sportsTypeModel.schema,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  interval: intervalModel.schema,
  howToPlay: String,
  maxFixtureCount: Number,
  enabled: Boolean,
  poolType: poolTypeModel.schema,
  preferredTeams: [teamModel.schema],
  casting: castingModel.schema,
  scoring: {
    type: String,
    enum: [SCORING_ALGORITHMS.DEFAULT]
  },
  distributing: distributingSchema,
  specification: soccerPoolGroupSchema
}, { discriminatorKey: '__t' });

poolGroupSchema.path('specification').discriminator(SPORTS_TYPES.SOCCER, soccerPoolGroupSchema);

poolGroupSchema.statics.deletePoolGroup = async function ({ _id }) {
  const pools = await poolModel.find({ poolGroupId: _id });
  for (const pool of pools) {
    await castModel.deleteMany({ pool: pool._id });
  }
  await poolModel.deleteMany({ poolGroupId: _id });
  return await this.model('poolGroup').findOneAndDelete({ _id });
};

const poolGroupModel = mongoose.model('poolGroup', poolGroupSchema);

export default poolGroupModel;
