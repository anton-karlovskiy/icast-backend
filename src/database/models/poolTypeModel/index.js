
import mongoose from 'mongoose';

import { POOL_TYPES } from '~/utils/constants';

const poolTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [POOL_TYPES.PAID, POOL_TYPES.FREE],
    default: POOL_TYPES.PAID
  }
});

const poolTypeModel = mongoose.model('poolType', poolTypeSchema);

export default poolTypeModel;
