
import mongoose from 'mongoose';

import leagueModel from '~/database/models/leagueModel';

const soccerTeamSchema = new mongoose.Schema({
  league: leagueModel.schema
});

export default soccerTeamSchema;
