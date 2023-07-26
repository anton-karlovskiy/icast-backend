
import mongoose from 'mongoose';

import { DISTRIBUTING_TYPES } from '~/utils/constants';

const distributingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      DISTRIBUTING_TYPES.PERCENTILE,
      DISTRIBUTING_TYPES.PRIZE
    ]
  },
  percentiles: [{
    ranking: {
      type: Number,
      required: true
    },
    threshold: {
      type: Number,
      required: true
    },
    slab: {
      type: Number,
      required: true
    }
  }],
  prizes: [{
    ranking: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  potSize: {
    type: Number,
    required: true
  }
});

export default distributingSchema;
