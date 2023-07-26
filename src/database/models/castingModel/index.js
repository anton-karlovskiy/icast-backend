
import mongoose from 'mongoose';

import soccerCastingSchema from './soccer';
import { SPORTS_TYPES } from '~/utils/constants';

const castingSchema = new mongoose.Schema({
  specification: soccerCastingSchema
}, { discriminatorKey: '__t' });

castingSchema.path('specification').discriminator(SPORTS_TYPES.SOCCER, soccerCastingSchema);
const castingModel = mongoose.model('casting', castingSchema);

export default castingModel;
