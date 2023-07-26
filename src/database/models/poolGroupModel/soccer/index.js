
import mongoose from 'mongoose';

import leagueModel from '~/database/models/leagueModel';

const soccerPoolGroupSchema = new mongoose.Schema({
  isHomeFirst: Boolean,
  leagues: [leagueModel.schema]
});

export default soccerPoolGroupSchema;
