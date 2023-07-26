
import mongoose from 'mongoose';

import leagueModel from '~/database/models/leagueModel';
import teamModel from '~/database/models/teamModel';

const soccerFixtureSchema = new mongoose.Schema({
  staticId: Number,
  league: leagueModel.schema,
  homeTeam: teamModel.schema,
  awayTeam: teamModel.schema,
  goalsHomeTeam: String,
  goalsAwayTeam: String
});

export default soccerFixtureSchema;
