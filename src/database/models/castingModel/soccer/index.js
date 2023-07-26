
import mongoose from 'mongoose';

import { CASTING_TYPES } from '~/utils/constants';

const castingSchema = new mongoose.Schema({
  castingType: {
    type: String,
    enum: [
      CASTING_TYPES.SOCCER.EXACT_SCORE,
      CASTING_TYPES.SOCCER.DRAW,
      CASTING_TYPES.SOCCER.WINNER,
      CASTING_TYPES.SOCCER.OUTCOME
    ],
    default: CASTING_TYPES.SOCCER.EXACT_SCORE
  }
});

export default castingSchema;
