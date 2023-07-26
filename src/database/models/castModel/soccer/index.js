
import mongoose from 'mongoose';

const soccerCastInfoSchema = new mongoose.Schema({
  goalsHomeTeam: {
    type: Number,
    required: true
  },
  goalsAwayTeam: {
    type: Number,
    required: true
  }
});

export default soccerCastInfoSchema;
