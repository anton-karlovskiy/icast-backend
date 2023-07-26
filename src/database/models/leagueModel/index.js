
import mongoose from 'mongoose';

import sportsTypeModel from '~/database/models/sportsTypeModel';

const leagueSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sportsType: sportsTypeModel.schema,
  country: String,
  season: String,
  startDate: Date,
  endDate: Date
});

const leagueModel = mongoose.model('league', leagueSchema);

export default leagueModel;
