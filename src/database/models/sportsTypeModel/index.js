
import mongoose from 'mongoose';
import { SPORTS_TYPES } from '~/utils/constants';

const sportsTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [SPORTS_TYPES.SOCCER, SPORTS_TYPES.CRICKET, SPORTS_TYPES.HORSE_RACING],
    default: SPORTS_TYPES.SOCCER,
    required: true
  }
});

const sportsTypeModel = mongoose.model('sportsType', sportsTypeSchema);

export default sportsTypeModel;
